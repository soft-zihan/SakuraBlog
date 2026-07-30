<!-- 搜索栏 -->
  <el-form :inline="true" :model="" class="demo-form-inline">
    <el-form-item label="姓名">
      <el-input v-model="" placeholder="请输入姓名"/>
    </el-form-item>

    <el-form-item label="性别">
      <el-select v-model="" placeholder="请选择">
        <el-option label="男" value="1" />
        <el-option label="女" value="2" />
      </el-select>
    </el-form-item>

    <el-form-item label="入职时间">
      <el-date-picker
        v-model=""
        type="daterange"
        range-separator="到"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        value-format="YYYY-MM-DD"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="">查询</el-button>
      <el-button @click="">清空</el-button>
    </el-form-item>
  </el-form>

  <!-- 功能按钮 -->
  <el-button type="success" @click="">+ 新增员工</el-button>
  <el-button type="danger" @click="">- 批量删除</el-button>
  <br><br>
