<template>
  <div class="app-container">
    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px" append-to-body>
      <el-form ref="formRef" :model="formData" :rules="formRules" v-loading="formLoading" >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="一级分类" prop="typeFirst">
              <el-select v-model="formData.typeFirst" style="width: 100%;" placeholder="请选择一级分类" clearable filterable @change="updateSecondLevelOptions">
                <el-option
                  v-for="category in categories"
                  :key="category.label"
                  :label="category.label"
                  :value="category.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二级分类" prop="typeSecond">
              <el-select v-model="formData.typeSecond" style="width: 100%;" placeholder="请选择二级分类" clearable filterable @change="updateThirdLevelOptions">
                <el-option
                  v-for="option in secondLevelOptions"
                  :key="option.label"
                  :label="option.label"
                  :value="option.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="三级分类" prop="typeThird">
              <el-select v-model="formData.typeThird" style="width: 100%;" placeholder="请选择三级分类" clearable filterable>
                <el-option
                  v-for="option in thirdLevelOptions"
                  :key="option.label"
                  :label="option.label"
                  :value="option.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否纳入成本核算模型" prop="enable" >
              <el-radio-group v-model="formData.enable" style="width: 100%;">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :disabled="formLoading">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as tenantApi from '@/api/tenant/index'
import { categories } from '../data'
export default {
  name: 'tenantDialog',
  props: {
    tenantType: {
      type: String,
      default: 'inside'
    }
  },
  created () {

  },
  components: {},
  data () {
    return {
      // 弹出层标题
      dialogTitle: '新增',
      // 是否显示弹出层
      dialogVisible: false,
      // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
      formLoading: false,
      // 表单参数
      formData: {
        id: undefined,
        tenantType: undefined,
        typeFirst: undefined,
        typeSecond: undefined,
        typeThird: undefined,
        enable: undefined
      },
      // 表单校验
      formRules: {
        productName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }]
      },
      // 数据本地
      categories: categories,
      selectedCategory: '',
      selectedSecondLevel: '',
      selectedThirdLevel: '',
      secondLevelOptions: [],
      thirdLevelOptions: []
    }
  },
  methods: {
    /** 打开弹窗 */
    async open (id, title, type) {
      this.dialogTitle = '新增租户投入要素'
      if (id === undefined) {
        this.reset()
      }
      this.dialogVisible = true
      this.dialogTitle = title

      if (id) {
        this.formLoading = true
        try {
          const res = await tenantApi.getInputFactor(id)
          console.log('打印结果', res.data)
          if (res.data.typeFirst) {
            this.updateSecondLevelOptions(res.data.typeFirst)
          }
          if (res.data.typeSecond) {
            this.updateThirdLevelOptions(res.data.typeSecond)
          }

          this.formData = res.data
          this.dialogTitle = '修改租户投入要素'
        } finally {
          this.formLoading = false
        }
      }
      this.formData.tenantType = type
    },
    updateSecondLevelOptions (value) {
      const selectedCategory = this.categories.find(category => category.label === value)
      this.secondLevelOptions = selectedCategory ? selectedCategory.children : []
      this.selectedSecondLevel = ''
      this.selectedThirdLevel = ''
    },
    updateThirdLevelOptions (value) {
      const selectedSecondLevel = this.secondLevelOptions.find(option => option.label === value)
      this.thirdLevelOptions = selectedSecondLevel ? selectedSecondLevel.children : []
      this.selectedThirdLevel = ''
    },
    /** 提交按钮 */
    async submitForm () {
      // 校验主表
      await this.$refs.formRef.validate()
      this.formLoading = true
      try {
        const data = this.formData
        // 修改的提交
        if (data.id) {
          await tenantApi.updateInputFactor(data)
          this.$modal.msgSuccess('修改成功')
          this.dialogVisible = false
          this.$emit('success')
          return
        }
        // 添加的提交
        await tenantApi.createInputFactor(data)
        this.$modal.msgSuccess('新增成功')
        this.dialogVisible = false
        this.$emit('success')
      } finally {
        this.formLoading = false
      }
    },
    /** 表单重置 */
    reset () {
      this.formData = {
        id: undefined,
        tenantType: undefined,
        typeFirst: undefined,
        typeSecond: undefined,
        typeThird: undefined,
        enable: undefined
      }
      this.resetForm('formRef')
    }
  }
}
</script>
