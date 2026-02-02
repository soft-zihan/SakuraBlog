import os
import json

# ================= 配置区域 =================
# 源文件目录
SOURCE_DIR = r"D:\_git\soft-zihan.github.io\gushiwen\guwen"
# 如果你想合并上一步清洗后的文件，可以将上面改成: r"./output"

# 输出文件名
OUTPUT_FILE = "./all_merged.json"
# ===========================================

def load_json_file(file_path):
    """
    读取文件，兼容标准 JSON 列表和 JSON Lines
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read().strip()
        
    try:
        # 尝试解析为整个 JSON 对象/数组
        data = json.loads(content)
        # 如果是单个字典对象，转为列表以便合并
        if isinstance(data, dict):
            return [data]
        return data
    except json.JSONDecodeError:
        # 解析失败，尝试按行解析 (JSON Lines)
        data = []
        lines = content.split('\n')
        for line in lines:
            line = line.strip()
            if line:
                try:
                    data.append(json.loads(line))
                except:
                    pass
        return data

def main():
    # 检查源目录
    if not os.path.exists(SOURCE_DIR):
        print(f"错误: 找不到目录 {SOURCE_DIR}")
        return

    all_data = []
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith('.json')]
    total_files = len(files)
    
    print(f"开始合并 {SOURCE_DIR} 下的 {total_files} 个文件...")

    for i, filename in enumerate(files):
        file_path = os.path.join(SOURCE_DIR, filename)
        
        try:
            file_data = load_json_file(file_path)
            
            if isinstance(file_data, list):
                all_data.extend(file_data)
            else:
                # 理论上 load_json_file 已经处理了 dict，这里防万一
                all_data.append(file_data)
                
            # 打印进度 (每处理100个文件显示一次，避免刷屏)
            if (i + 1) % 100 == 0:
                print(f"进度: {i + 1}/{total_files}...")
                
        except Exception as e:
            print(f"读取文件失败: {filename}, 错误: {e}")

    print(f"合并完成！总共收集到 {len(all_data)} 条数据。")
    print(f"正在写入 {OUTPUT_FILE} ...")

    # 写入最终的大文件
    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f_out:
            # ensure_ascii=False 保证中文正常显示
            # indent=None 不换行缩进，减小文件体积；若需要可读性改为 indent=2
            json.dump(all_data, f_out, ensure_ascii=False, indent=None)
        print(f"成功！文件已保存至: {os.path.abspath(OUTPUT_FILE)}")
    except Exception as e:
        print(f"写入文件失败: {e}")

if __name__ == "__main__":
    main()