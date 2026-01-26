//表单校验规则
const empFormRef = ref<FormInstance>()
const rules = ref<FormRules<EmpModel>>({
  username: [
    { required: true, message: '用户名为必填项', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度为2-20个字', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '姓名为必填项', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度为2-10个字', trigger: 'blur' }
  ],
  gender: [{ required: true, message: '性别为必填项', trigger: 'change' }],
  phone: [
    { required: true, message: '手机号为必填项', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/g, message: '请输入合法的手机号', trigger: 'blur' }
  ],
  salary: [
    { pattern: /^[1-9]\d*$/g, message: '请输入合法的数字', trigger: 'blur' }
  ]
})
