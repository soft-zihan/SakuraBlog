import os
import json

# 配置路径
# 注意：Windows路径建议在字符串前加 r，防止转义字符问题
SOURCE_DIR = r"D:\_git\soft-zihan.github.io\gushiwen\guwen"
OUTPUT_DIR = "./output"

# 需要删除的字段列表
KEYS_TO_REMOVE = ["type", "audioUrl"]

# 需要检查的字段（如果这些字段全都不存在或为空，则删除整条数据）
KEYS_TO_CHECK = ["remark", "translation", "shangxi"]

def process_data(data_list):
    """
    处理数据列表：过滤对象并移除指定字段
    """
    processed_list = []
    
    for item in data_list:
        if not isinstance(item, dict):
            continue

        # 1. 检查过滤条件：是否同时没有 remark, translation, shangxi
        # 这里使用 bool(item.get(key)) 来判断，意味着如果字段不存在、是None、或是空字符串，都视为"没有"
        has_content = False
        for key in KEYS_TO_CHECK:
            if item.get(key): 
                has_content = True
                break
        
        # 如果三个字段都没有，跳过该对象（即删除）
        if not has_content:
            continue

        # 2. 删除指定字段 (type, audioUrl)
        for key in KEYS_TO_REMOVE:
            if key in item:
                del item[key]
                # 或者使用 item.pop(key, None) 以防报错

        processed_list.append(item)
    
    return processed_list

def load_json_file(file_path):
    """
    尝试读取 JSON 文件，兼容标准 JSON 数组和 JSON Lines 格式
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read().strip()
        
    try:
        # 尝试作为标准 JSON 数组读取 [{}, {}]
        return json.loads(content)
    except json.JSONDecodeError:
        # 如果失败，尝试作为 JSON Lines 读取 (每行一个 {})
        data = []
        lines = content.split('\n')
        for line in lines:
            line = line.strip()
            if line:
                try:
                    data.append(json.loads(line))
                except json.JSONDecodeError:
                    print(f"警告: 无法解析文件 {file_path} 中的某一行")
        return data

def main():
    # 确保输出目录存在
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"已创建输出目录: {OUTPUT_DIR}")

    # 检查源目录是否存在
    if not os.path.exists(SOURCE_DIR):
        print(f"错误: 源目录不存在 -> {SOURCE_DIR}")
        return

    # 遍历文件
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith('.json')]
    total_files = len(files)
    print(f"找到 {total_files} 个 JSON 文件，开始处理...")

    for i, filename in enumerate(files):
        source_path = os.path.join(SOURCE_DIR, filename)
        output_path = os.path.join(OUTPUT_DIR, filename)

        try:
            # 读取数据
            data = load_json_file(source_path)
            
            # 处理数据
            if isinstance(data, list):
                new_data = process_data(data)
                
                # 写入数据
                with open(output_path, 'w', encoding='utf-8') as f:
                    # ensure_ascii=False 保证输出中文而不是 \uXXXX
                    # indent=2 进行格式化缩进，如果想压缩文件大小可去掉 indent
                    json.dump(new_data, f, ensure_ascii=False, indent=2)
                
                print(f"[{i+1}/{total_files}] 处理完成: {filename} (保留记录: {len(new_data)}/{len(data)})")
            else:
                print(f"[{i+1}/{total_files}] 跳过: {filename} (格式不符合预期)")

        except Exception as e:
            print(f"[{i+1}/{total_files}] 处理出错: {filename}, 错误信息: {e}")

    print("\n所有任务完成！")

if __name__ == "__main__":
    main()