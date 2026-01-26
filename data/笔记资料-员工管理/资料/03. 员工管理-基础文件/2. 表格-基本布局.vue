
  <!-- 列表展示 -->
  <el-table :data="empList" border style="width: 100%" fit >
    <el-table-column prop="name" label="姓名" align="center" width="130px" />
    <el-table-column prop="gender" label="性别" align="center" width="100px"/>
    <el-table-column prop="image" label="头像" align="center"/>
    <el-table-column prop="deptName" label="所属部门" align="center" />
    <el-table-column prop="job" label="职位" align="center" width="100px"/>
    <el-table-column prop="entryDate" label="入职时间" align="center" width="130px" />
    <el-table-column prop="updateTime" label="最后修改时间" align="center" />
    <el-table-column label="操作" align="center">
      <template #default="scope">
        <el-button type="primary" size="small" @click="">编辑</el-button>
        <el-button type="danger" size="small" @click="">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <br>

  <!-- 分页组件Pagination -->
  <el-pagination
    v-model:current-page="pagination.currentPage"
    v-model:page-size="pagination.pageSize"
    :page-sizes="[5, 10, 20, 50, 100]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="pagination.total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />