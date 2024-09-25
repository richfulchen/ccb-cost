<template>
  <div class="app-container" v-loading="isValidateAndRedirect" element-loading-text="加载中">
    <el-tabs v-model="tenantType" @tab-click="handleClick" >
      <el-tab-pane label="内部租户" name="inside">
        <!-- 搜索工作栏 -->
        <el-card class="mb20" shadow="never" v-show="showSearch">
          <el-form :model="queryParams" ref="queryForm" size="small" :inline="false" >
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="一级分类" prop="typeFirst">
                  <el-select v-model="queryParams.typeFirst" style="width: 100%;" placeholder="请选择一级分类" clearable filterable @change="updateSecondLevelOptions">
                    <el-option
                      v-for="category in categories"
                      :key="category.label"
                      :label="category.label"
                      :value="category.label"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="二级分类" prop="typeSecond">
                  <el-select v-model="queryParams.typeSecond" style="width: 100%;" placeholder="请选择二级分类" clearable filterable @change="updateThirdLevelOptions">
                    <el-option
                      v-for="option in secondLevelOptions"
                      :key="option.label"
                      :label="option.label"
                      :value="option.label"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="三级分类" prop="typeThird">
                  <el-select v-model="queryParams.typeThird" style="width: 100%;" placeholder="请选择三级分类" clearable filterable>
                    <el-option
                      v-for="option in thirdLevelOptions"
                      :key="option.label"
                      :label="option.label"
                      :value="option.label"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="是否纳入成本核算模型" prop="enable">
                  <el-select v-model="queryParams.enable" placeholder="请选择是否纳入成本核算模型" clearable size="small" style="width: 100%;">
                    <el-option label="是" :value="true"></el-option>
                    <el-option label="否" :value="false"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24" class="mt10">
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                  <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </el-card>
        <el-row :gutter="10" class="mb20">
          <el-col :span="1.5">
            <el-button type="primary" @click="openForm(undefined, '新增租户投入要素')"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" @click="handleImport"
                       :loading="exportLoading"
            >导入
            </el-button>
          </el-col>
          <div style="float: right; display: flex; align-items: center">
            <el-button
              type="danger"
              style="margin-right: 0px"
              @click="handleDeleteAll"
            >全部删除</el-button>
            <el-button
              type="primary"
              style="margin-right: 20px"
              :loading="exportLoading"
              @click="handleExport"
            >导出</el-button>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
          </div>
        </el-row>
        <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
          <el-table-column
            type="index"
            label="序号"
            width="55">
          </el-table-column>
          <el-table-column label="一级分类" align="center" prop="typeFirst" v-if="columns[0].visible"/>
          <el-table-column label="二级分类" align="center" prop="typeSecond" v-if="columns[1].visible"/>
          <el-table-column label="三级分类" align="center" prop="typeThird" v-if="columns[2].visible"/>
          <el-table-column label="是否纳入成本核算模型" align="center" prop="enable" v-if="columns[3].visible">
            <template v-slot="scope">
              <el-switch
                v-model="scope.row.enable" @change="switchAction($event, scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template v-slot="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="openForm(scope.row.id, '修改')"
              >修改
              </el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                    @pagination="getList"
        />
      </el-tab-pane>
      <el-tab-pane label="外部租户" name="outside">
        <!-- 搜索工作栏 -->
        <el-card class="mb20" shadow="never" v-show="showSearch">
          <el-form :model="queryParams" ref="queryForm" size="small" :inline="false" >
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="一级分类" prop="typeFirst">
                  <el-select v-model="queryParams.typeFirst" style="width: 100%;" placeholder="请选择一级分类" clearable filterable @change="updateSecondLevelOptions">
                    <el-option
                      v-for="category in categories"
                      :key="category.label"
                      :label="category.label"
                      :value="category.label"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="二级分类" prop="typeSecond">
                  <el-select v-model="queryParams.typeSecond" style="width: 100%;" placeholder="请选择二级分类" clearable filterable @change="updateThirdLevelOptions">
                    <el-option
                      v-for="option in secondLevelOptions"
                      :key="option.label"
                      :label="option.label"
                      :value="option.label"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="三级分类" prop="typeThird">
                  <el-select v-model="queryParams.typeThird" style="width: 100%;" placeholder="请选择三级分类" clearable filterable>
                    <el-option
                      v-for="option in thirdLevelOptions"
                      :key="option.label"
                      :label="option.label"
                      :value="option.label"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="是否纳入成本核算模型" prop="enable">
                  <el-select v-model="queryParams.enable" placeholder="请选择是否纳入成本核算模型" clearable size="small" style="width: 100%;">
                    <el-option label="是" :value="true"></el-option>
                    <el-option label="否" :value="false"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24" class="mt10">
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                  <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </el-card>
        <el-row :gutter="10" class="mb20">
          <el-col :span="1.5">
            <el-button type="primary" @click="openForm(undefined, '新增租户投入要素')"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" @click="handleImport"
            >导入
            </el-button>
          </el-col>
          <div style="float: right; display: flex; align-items: center">
            <el-button
              type="danger"
              style="margin-right: 0px"
              @click="handleDeleteAll"
            >全部删除</el-button>
            <el-button
              type="primary"
              style="margin-right: 20px"
              :loading="exportLoading"
              @click="handleExport"
            >导出</el-button>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
          </div>
        </el-row>
        <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
          <el-table-column
            type="index"
            label="序号"
            width="55">
          </el-table-column>
          <el-table-column label="一级分类" align="center" prop="typeFirst" v-if="columns[0].visible"/>
          <el-table-column label="二级分类" align="center" prop="typeSecond" v-if="columns[1].visible"/>
          <el-table-column label="三级分类" align="center" prop="typeThird" v-if="columns[2].visible"/>
          <el-table-column label="是否纳入成本核算模型" align="center" prop="enable" v-if="columns[3].visible">
            <template v-slot="scope">
              <el-switch
                v-model="scope.row.enable" @change="switchAction($event, scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template v-slot="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="openForm(scope.row.id, '修改')"
              >修改
              </el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                    @pagination="getList"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- 对话框(添加 / 修改) -->
    <TenantDialog ref="formRef" @success="getList"/>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls"
                 :action="upload.url" :disabled="upload.isUploading"
                 :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as tenantApi from '@/api/tenant/index'
import TenantDialog from './components/tenantDialog.vue'
import { categories } from './data'
import download from '@/plugins/download'
import { checkVerify } from '@/api/ccb'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'tenant',
  components: {
    TenantDialog
  },
  data () {
    return {
      // 当前验证结果
      isValidateAndRedirect: false,
      tenantType: 'inside',
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 资源超卖配置列表
      list: [],
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 选中行
      currentRow: {},
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        tenantType: null,
        typeFirst: null,
        typeSecond: null,
        typeThird: null,
        enable: null
      },
      columns: [
        { key: 0, label: '一级分类', visible: true },
        { key: 1, label: '二级分类', visible: true },
        { key: 2, label: '三级分类', visible: true },
        { key: 3, label: '是否纳入成本核算模型', visible: true }
      ],
      // 数据本地
      categories: categories,
      selectedCategory: '',
      selectedSecondLevel: '',
      selectedThirdLevel: '',
      secondLevelOptions: [],
      thirdLevelOptions: [],
      // 导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/admin-api/system/input-factor/import'
      }
    }
  },
  created () {
    // this.validateAndRedirect()
    this.getList()
  },
  methods: {
    /** 接口校验 */
    validateAndRedirect () {
      this.isValidateAndRedirect = true
      checkVerify().then(response => {
        // 处理响应
        this.isValidateAndRedirect = false
        console.log('响应数据:', response.data)
        if (response.data.code === 200) {
          console.log('登录验证成功')
          this.getList()
        } else {
          console.error('登录验证失败')
        }
      }).catch(error => {
        // 处理错误
        console.error('请求失败:', error)
        this.isValidateAndRedirect = false
        this.$modal.notifyError(error.toLocaleString())
        // 改变顶层窗口的位置
        window.top.location.href = 'http://api.bssmgt.yuncpt.ccb.com/'
        // // 将iframe的src指向登录页面
        // if (window.parent && window.parent.document.getElementById('yourIframeId')) {
        //   window.parent.document.getElementById('yourIframeId').src = 'http://your-main-system-login-url';
        // }
      })
    },
    /** 查询列表 */
    async getList () {
      try {
        this.queryParams.tenantType = this.tenantType
        this.loading = true
        const res = await tenantApi.getInputFactorPage(this.queryParams)
        console.log(' getList res: ', res)
        this.list = res.data.list
        this.total = res.data.total
      } catch (err) {
        this.loading = false
      } finally {
        this.loading = false
      }
    },
    handleClick (tab, event) {
      console.log(tab, event)
      this.getList()
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNo = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 添加/修改操作 */
    openForm (row, title) {
      this.$refs.formRef.open(row, title, this.tenantType)
    },
    /** 根据开关更新数据 */
    async switchAction (event, row) {
      const enable = event
      const data = row
      console.log(' switchAction data: ', data, enable)
      data.enable = enable
      const res = await tenantApi.updateInputFactor(data)
      console.log(' switchAction res: ', res)
      if (res.data.code === 0) {
        this.$message.success('更新成功')
      }
      await this.getList()
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
    /** 删除按钮操作 */
    async handleDelete (row) {
      const id = row.id
      await this.$modal.confirm('是否确认删除租户投入要素编号为"' + id + '"的数据项?')
      try {
        await tenantApi.deleteInputFactor(id)
        await this.getList()
        this.$modal.msgSuccess('删除成功')
      } catch {}
    },
    /**
     * 全部删除
     */
    async handleDeleteAll () {
      await this.$modal.confirm('是否确认删除所有数据项?')
      try {
        await tenantApi.deleteAllInputFactor(this.tenantType)
        await this.getList()
        this.$modal.msgSuccess('删除成功')
      } catch {}
    },
    /** 导出按钮操作 */
    async handleExport () {
      await this.$modal.confirm('是否确认导出所有租户投入要素数据项?')
      try {
        this.exportLoading = true
        const res = await tenantApi.exportInputFactorExcel(this.queryParams)
        this.$download.excel(res, (this.tenantType === 'inside' ? '内部租户投入要素' : '外部租户投入要素') + '.xls')
      } catch {
      } finally {
        this.exportLoading = false
      }
    },
    /** 导入操作 */
    async handleImport () {
      this.upload.title = (this.tenantType === 'inside' ? '内部租户投入要素导入' : '外部租户投入要素导入')
      if (this.tenantType === 'inside') {
        this.upload.url = process.env.VUE_APP_BASE_API + '/admin-api/system/input-factor/import?tenantType=inside'
      } else {
        this.upload.url = process.env.VUE_APP_BASE_API + '/admin-api/system/input-factor/import?tenantType=outside'
      }
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
      this.upload.open = true
    },
    /** 下载模板操作 */
    importTemplate () {
      if (this.tenantType === 'inside') {
        tenantApi.importTemplateIn().then(response => {
          download.excel(response, '内部租户成本要素导入模板.xls')
        })
      } else {
        tenantApi.importTemplateOut().then(response => {
          download.excel(response, '外部租户成本要素导入模板.xls')
        })
      }
    },
    // 文件上传中处理
    handleFileUploadProgress (event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess (response, file, fileList) {
      if (response.code !== 0) {
        this.$modal.notifyError(response.msg)
        return
      }
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      // 拼接提示语
      const data = response.data
      let text = '创建成功数量：' + data.createFactors.length
      for (const username of data.createFactors) {
        text += '<br />&nbsp;&nbsp;&nbsp;&nbsp;' + username
      }
      text += '<br />更新成功数量：' + data.updateFactors.length
      for (const username of data.updateFactors) {
        text += '<br />&nbsp;&nbsp;&nbsp;&nbsp;' + username
      }
      text += '<br />更新失败数量：' + Object.keys(data.failureFactors).length
      for (const username in data.failureFactors) {
        text += '<br />&nbsp;&nbsp;&nbsp;&nbsp;' + username + '：' + data.failureFactors[username]
      }
      this.$alert(text, '导入结果', { dangerouslyUseHTMLString: true })
      this.getList()
    },
    // 提交上传文件
    submitFileForm () {
      this.$refs.upload.submit()
    }
  }
}
</script>

<style scoped>

</style>
