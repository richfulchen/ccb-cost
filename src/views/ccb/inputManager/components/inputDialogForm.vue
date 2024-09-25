<template>
  <div class="app-container">
    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="55%" append-to-body>
      <el-form ref="formRef" :model="formData" :rules="formRules" v-loading="formLoading" :validate-on-rule-change="false">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="资产分类">
              <el-cascader
                ref="cascade"
                :key="clearForm"
                v-model="assetCategory"
                :disabled="formData.uniqueAssetCode!==undefined"
                :options="categories"
                :props="{ value: 'label', children: 'children'}"
                placeholder="请选择"
                @change="handleChange"
                style="width: 100%;"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <template v-if="assetCategory && assetCategory.length > 0">
            <el-col :span="24">
              <el-divider content-position="center"><span style="color: #00afff">资产基本信息</span></el-divider>
            </el-col>
            <el-col :span="12" v-if="currentTemplate !== '模板二' && currentTemplate !== '模板三'">
              <el-form-item label="序列号" prop="serialNumber">
                <el-input v-model="formData.serialNumber" placeholder="请输入序列号" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate !== '模板四' && currentTemplate !== '模板五' && currentTemplate !== '模板六'">
              <el-form-item label="合同号" prop="contractNumber">
                <el-input v-model="formData.contractNumber" placeholder="请输入合同号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="(currentTemplate === '模板二' || currentTemplate === '模板三') ? '名称' : '设备型号'" prop="model">
                <el-input v-model="formData.model" :placeholder="(currentTemplate === '模板二' || currentTemplate === '模板三') ? '请输入名称' : '请输入设备型号'" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="技术栈" prop="techStack">
                <el-input v-model="formData.techStack" placeholder="请输入技术栈" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地域" prop="region">
                <el-input v-model="formData.region" placeholder="请输入地域" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="可用区" prop="availabilityZone">
                <el-input v-model="formData.availabilityZone" placeholder="请输入可用区" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="型号名称" prop="vendorModel"  v-if="currentTemplate === '模板一'">
                <el-input v-model="formData.vendorModel" placeholder="请输入设备型号" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate === '模板二'">
              <el-form-item label="供应商" prop="vendor">
                <el-input v-model="formData.vendor" placeholder="请输入供应商" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate === '模板一'">
              <el-form-item label="配置概要" prop="configSummary">
                <el-input v-model="formData.configSummary" placeholder="请输入配置概要" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate !== '模板四' && currentTemplate !== '模板五' && currentTemplate !== '模板六'">
              <el-form-item label="事项编号" prop="matterNumber">
                <el-input v-model="formData.matterNumber" placeholder="请输入事项编号" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate !== '模板四' && currentTemplate !== '模板五' && currentTemplate !== '模板六'">
              <el-form-item label="开始使用日期" prop="startUseDate">
                <el-date-picker clearable v-model="formData.startUseDate" type="date" format="yyyy/M/d" value-format="yyyy/M/d" placeholder="选择开始使用日期" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate === '模板一' || currentTemplate === '模板二'">
              <el-form-item :label="currentTemplate === '模板一' ? '折旧开始日期' : '摊销开始日期'" prop="depreciationStartDate">
                <el-date-picker clearable v-model="formData.depreciationStartDate" type="date" :placeholder="currentTemplate === '模板一' ? '选择折旧开始日期' : '选择摊销开始日期'" format="yyyy/M/d" value-format="yyyy/M/d" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate === '模板三'">
              <el-form-item label="计算开始日期" prop="depreciationStartDate">
                <el-date-picker clearable v-model="formData.depreciationStartDate" type="date" placeholder="选择计算开始日期" format="yyyy/M/d" value-format="yyyy/M/d" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-divider content-position="center"><span style="color: #00afff">成本信息</span></el-divider>
            </el-col>
            <el-col :span="12" v-if="currentTemplate === '模板六'">
              <el-form-item label="机房环境采购单价（元）" prop="unitPrice">
                <el-input type="number" v-model="formData.unitPrice" placeholder="请输入采购单价（元）" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate !== '模板四'">
              <el-form-item label="保有量" prop="quantity">
                <el-input type="number" v-model="formData.quantity" placeholder="请输入保有量" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate !== '模板四'">
              <el-form-item label="保有量单位" prop="quantityUnit">
                <el-input v-model="formData.quantityUnit" placeholder="请输入保有量单位" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate === '模板三' || currentTemplate === '模板二'">
              <el-form-item label="采购单价（元）" prop="unitPrice">
                <el-input type="number" v-model="formData.unitPrice" placeholder="请输入采购单价（元）" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate === '模板一'">
              <el-form-item label="合同单价（元）" prop="contractUnitPrice">
                <el-input type="number" v-model="formData.contractUnitPrice" placeholder="请输入合同单价（元）" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate !== '模板三' && currentTemplate !== '模板四' && currentTemplate !== '模板六'">
              <el-form-item label="残值率" prop="residualValueRate">
                <el-input type="number" v-model="formData.residualValueRate" placeholder="请输入残值率" >

                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate !== '模板六' && currentTemplate !== '模板四'">
              <el-form-item label="月成本（元/月）" prop="monthlyCost">
                <el-input type="number" v-model="formData.monthlyCost" placeholder="请输入月成本（元/月）" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate === '模板一'">
              <el-form-item label="原始原值（元）" prop="unitPrice">
                <el-input type="number" v-model="formData.unitPrice" placeholder="请输入原始原值（元）" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate === '模板一' || currentTemplate === '模板五'">
              <el-form-item label="总原始原值（元）" prop="purchaseTotal">
                <el-input type="number" v-model="formData.purchaseTotal" placeholder="请输入总原始原值（元）" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate !== '模板一' && currentTemplate !== '模板四' && currentTemplate !== '模板五' && currentTemplate !== '模板六'">
              <el-form-item label="采购总价（元）" prop="purchaseTotal">
                <el-input type="number" v-model="formData.purchaseTotal" placeholder="请输入采购总价（元）" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate === '模板六'">
              <el-form-item label="采购总价（元/月）" prop="monthlyCost">
                <el-input type="number" v-model="formData.monthlyCost" placeholder="请输入采购总价（元/月）" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate === '模板四'">
              <el-form-item label="当地电价总价（元/月）" prop="monthlyCost">
                <el-input type="number" v-model="formData.monthlyCost" placeholder="请输入当地电价总价（元/月）"  style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate === '模板三'">
              <el-form-item label="服务期限（月）" prop="depreciationPeriod">
                <el-input type="number" v-model="formData.depreciationPeriod" placeholder="请输入服务期限（月）" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate === '模板一' || currentTemplate === '模板二' || currentTemplate === '模板五'">
              <el-form-item :label="currentTemplate === '模板二' ? '摊销年限（月）' : '折旧年限（月）'" prop="depreciationPeriod">
                <el-input type="number" v-model="formData.depreciationPeriod" :placeholder="currentTemplate === '模板二' ? '请输入摊销年限（月）' : '请输入折旧年限（月）'" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate === '模板五'">
              <el-form-item label="机柜原始原值（元）" prop="unitPrice">
                <el-input type="number" v-model="formData.unitPrice" placeholder="请输入机柜原始原值（元）" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate === '模板一'">
              <el-form-item label="资产类别" prop="assetSubcategory">
                <el-input v-model="formData.assetSubcategory" placeholder="请输入资产类别" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="资产状态" prop="assetStatus">
                <el-select v-model="formData.assetStatus" style="width: 100%;" placeholder="请选择资产状态" clearable >
                  <el-option label="使用中" value="使用中"/>
                  <el-option label="未使用" value="未使用"/>
                  <el-option label="闲置" value="闲置"/>
                </el-select>
              </el-form-item>
            </el-col>
            <!--          <el-col :span="12">-->
            <!--            <el-form-item label="所属领域" prop="domain">-->
            <!--              <el-input v-model="formData.domain" placeholder="请输入所属领域" />-->
            <!--            </el-form-item>-->
            <!--          </el-col>-->
            <!--          <el-col :span="12">-->
            <!--            <el-form-item label="所属产品" prop="product">-->
            <!--              <el-input v-model="formData.product" placeholder="请输入所属产品" />-->
            <!--            </el-form-item>-->
            <!--          </el-col>-->
            <!--          <el-col :span="12">-->
            <!--            <el-form-item label="所属子产品" prop="subProduct">-->
            <!--              <el-input v-model="formData.subProduct" placeholder="请输入所属子产品" />-->
            <!--            </el-form-item>-->
            <!--          </el-col>-->
            <!--          <el-col :span="12" v-if="currentTemplate === '模板一'">-->
            <!--            <el-form-item label="PAM组件1" prop="pamComponent1">-->
            <!--              <el-input v-model="formData.pamComponent1" placeholder="请输入PAM组件1" />-->
            <!--            </el-form-item>-->
            <!--          </el-col>-->
            <!--          <el-col :span="12" v-if="currentTemplate === '模板一'">-->
            <!--            <el-form-item label="PAM组件2" prop="pamComponent2">-->
            <!--              <el-input v-model="formData.pamComponent2" placeholder="请输入PAM组件2" />-->
            <!--            </el-form-item>-->
            <!--          </el-col>-->
            <!--          <el-col :span="12" v-if="currentTemplate === '模板一'">-->
            <!--            <el-form-item label="PAM组件3" prop="pamComponent3">-->
            <!--              <el-input v-model="formData.pamComponent3" placeholder="请输入PAM组件3" />-->
            <!--            </el-form-item>-->
            <!--          </el-col>-->
            <el-col :span="24" v-if="currentTemplate !== '模板六' && currentTemplate !== '模板五'">
              <el-divider content-position="center"><span style="color: #00afff">其他信息</span></el-divider>
            </el-col>
            <el-col :span="12" v-if="currentTemplate === '模板一' || currentTemplate === '模板三'">
              <el-form-item label="规格" prop="specification">
                <el-input v-model="formData.specification" placeholder="请输入规格" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate === '模板一' || currentTemplate === '模板三'">
              <el-form-item label="厂商" prop="vendor">
                <el-input v-model="formData.vendor" placeholder="请输入厂商" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate === '模板一'">
              <el-form-item label="设备高度" prop="deviceHeight">
                <el-input v-model="formData.deviceHeight" placeholder="请输入设备高度" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate === '模板一' || currentTemplate === '模板四'">
              <el-form-item label="功率（千瓦）" prop="powerConsumption">
                <el-input v-model="formData.powerConsumption" placeholder="请输入功率（千瓦）" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentTemplate === '模板一' || currentTemplate === '模板二' || currentTemplate === '模板三'">
              <el-form-item label="备注" prop="remarks">
                <el-input type="textarea" v-model="formData.remarks" placeholder="请输入备注" style="width: 100%;"/>
              </el-form-item>
            </el-col>
          </template>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :disabled="formLoading">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as inputApi from '@/api/input/index'
import { categories, templateMapping } from '@/views/ccb/tenantManager/data'
export default {
  name: 'inputDialogForm',
  components: {
  },
  data () {
    return {
      categories,
      templateMapping,
      clearForm: 0,
      // 弹出层标题
      dialogTitle: '',
      // 是否显示弹出层
      dialogVisible: false,
      // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
      formLoading: false,
      // 资产分类
      assetCategory: [],
      // 当前分类三对应模板
      currentTemplate: undefined,
      // 表单参数
      formData: {
        id: undefined,
        uniqueAssetCode: undefined,
        contractUnitPrice: undefined,
        serialNumber: undefined,
        model: undefined,
        configSummary: undefined,
        vendorModel: undefined,
        contractNumber: undefined,
        matterNumber: undefined,
        techStack: undefined,
        region: undefined,
        availabilityZone: undefined,
        startUseDate: undefined,
        depreciationStartDate: undefined,
        assetCategory: undefined,
        assetSubcategory: undefined,
        unitPrice: undefined,
        originalValue: undefined,
        quantity: undefined,
        quantityUnit: undefined,
        totalOriginalValue: undefined,
        depreciationPeriod: undefined,
        residualValueRate: undefined,
        monthlyCost: undefined,
        assetStatus: undefined,
        domain: undefined,
        product: undefined,
        subProduct: undefined,
        pamComponent1: undefined,
        pamComponent2: undefined,
        pamComponent3: undefined,
        specification: undefined,
        vendor: undefined,
        deviceHeight: undefined,
        powerConsumption: undefined,
        remarks: undefined,
        purchaseTotal: undefined,
        servicePeriod: undefined,
        localElectricityPrice: undefined,
        cabinetOriginalValue: undefined,
        environmentUnitPrice: undefined
      },
      formRules: {},
      // 表单校验
      rulesDict: {
        模板一: {
          serialNumber: [{ required: true, message: '序列号不能为空', trigger: 'blur' }],
          model: [{ required: true, message: '设备型号不能为空', trigger: 'blur' }],
          techStack: [{ required: true, message: '技术栈不能为空', trigger: 'blur' }],
          region: [{ required: true, message: '地域不能为空', trigger: 'blur' }],
          availabilityZone: [{ required: true, message: '可用区不能为空', trigger: 'blur' }],
          startUseDate: [{ required: true, message: '开始使用日期不能为空', trigger: 'blur' }],
          depreciationStartDate: [{ required: true, message: '折旧开始日期不能为空', trigger: 'blur' }],
          assetCategory: [{ required: true, message: '资产分类不能为空', trigger: 'blur' }],
          assetSubcategory: [{ required: true, message: '资产类别不能为空', trigger: 'blur' }],
          contractUnitPrice: [{ required: true, message: '合同单价（元）不能为空', trigger: 'blur' }],
          unitPrice: [{ required: true, message: '原始原值（元）不能为空', trigger: 'blur' }],
          quantity: [{ required: true, message: '保有量不能为空', trigger: 'blur' }],
          quantityUnit: [{ required: true, message: '保有量单位不能为空', trigger: 'blur' }],
          purchaseTotal: [{ required: true, message: '总原始原值（元）不能为空', trigger: 'blur' }],
          depreciationPeriod: [{ required: true, message: '折旧年限（月）不能为空', trigger: 'blur' }],
          residualValueRate: [{ required: true, message: '残值率不能为空', trigger: 'blur' }],
          monthlyCost: [{ required: true, message: '月成本（元/月）不能为空', trigger: 'blur' }],
          assetStatus: [{ required: true, message: '资产状态不能为空', trigger: 'blur' }]
          // domain: [{ required: true, message: '所属领域不能为空', trigger: 'blur' }],
          // product: [{ required: true, message: '所属产品不能为空', trigger: 'blur' }],
          // subProduct: [{ required: true, message: '所属子产品不能为空', trigger: 'blur' }],
          // pamComponent1: [{ required: true, message: 'PAM组件1不能为空', trigger: 'blur' }],
          // pamComponent2: [{ required: true, message: 'PAM组件2不能为空', trigger: 'blur' }],
          // pamComponent3: [{ required: true, message: 'PAM组件3不能为空', trigger: 'blur' }]
        },
        模板二: {
          model: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
          techStack: [{ required: true, message: '技术栈不能为空', trigger: 'blur' }],
          region: [{ required: true, message: '地域不能为空', trigger: 'blur' }],
          startUseDate: [{ required: true, message: '开始使用日期不能为空', trigger: 'blur' }],
          depreciationStartDate: [{ required: true, message: '摊销开始日期不能为空', trigger: 'blur' }],
          assetCategory: [{ required: true, message: '资产分类不能为空', trigger: 'blur' }],
          purchaseTotal: [{ required: true, message: '采购总价不能为空', trigger: 'blur' }],
          depreciationPeriod: [{ required: true, message: '摊销年限（月）不能为空', trigger: 'blur' }],
          residualValueRate: [{ required: true, message: '残值率不能为空', trigger: 'blur' }],
          monthlyCost: [{ required: true, message: '月成本（元/月）不能为空', trigger: 'blur' }],
          assetStatus: [{ required: true, message: '资产状态不能为空', trigger: 'blur' }]
          // domain: [{ required: true, message: '所属领域不能为空', trigger: 'blur' }],
          // product: [{ required: true, message: '所属产品不能为空', trigger: 'blur' }],
          // subProduct: [{ required: true, message: '所属子产品不能为空', trigger: 'blur' }]
        },
        模板三: {
          model: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
          techStack: [{ required: true, message: '技术栈不能为空', trigger: 'blur' }],
          region: [{ required: true, message: '地域不能为空', trigger: 'blur' }],
          startUseDate: [{ required: true, message: '开始使用日期不能为空', trigger: 'blur' }],
          assetCategory: [{ required: true, message: '资产分类不能为空', trigger: 'blur' }],
          purchaseTotal: [{ required: true, message: '采购总价不能为空', trigger: 'blur' }],
          depreciationPeriod: [{ required: true, message: '服务期限（月）不能为空', trigger: 'blur' }],
          monthlyCost: [{ required: true, message: '月成本（元/月）不能为空', trigger: 'blur' }],
          assetStatus: [{ required: true, message: '资产状态不能为空', trigger: 'blur' }],
          depreciationStartDate: [{ required: true, message: '计算开始日期不能为空', trigger: 'blur' }]
          // domain: [{ required: true, message: '所属领域不能为空', trigger: 'blur' }],
          // product: [{ required: true, message: '所属产品不能为空', trigger: 'blur' }],
          // subProduct: [{ required: true, message: '所属子产品不能为空', trigger: 'blur' }]
        },
        模板四: {
          serialNumber: [{ required: true, message: '序列号不能为空', trigger: 'blur' }],
          model: [{ required: true, message: '设备型号不能为空', trigger: 'blur' }],
          techStack: [{ required: true, message: '技术栈不能为空', trigger: 'blur' }],
          region: [{ required: true, message: '地域不能为空', trigger: 'blur' }],
          availabilityZone: [{ required: true, message: '可用区不能为空', trigger: 'blur' }],
          assetCategory: [{ required: true, message: '资产分类不能为空', trigger: 'blur' }],
          assetStatus: [{ required: true, message: '资产状态不能为空', trigger: 'blur' }],
          monthlyCost: [{ required: true, message: '当地电价总价（元）不能为空', trigger: 'blur' }]
          // domain: [{ required: true, message: '所属领域不能为空', trigger: 'blur' }],
          // product: [{ required: true, message: '所属产品不能为空', trigger: 'blur' }],
          // subProduct: [{ required: true, message: '所属子产品不能为空', trigger: 'blur' }]
        },
        模板五: {
          serialNumber: [{ required: true, message: '序列号不能为空', trigger: 'blur' }],
          model: [{ required: true, message: '设备型号不能为空', trigger: 'blur' }],
          techStack: [{ required: true, message: '技术栈不能为空', trigger: 'blur' }],
          region: [{ required: true, message: '地域不能为空', trigger: 'blur' }],
          availabilityZone: [{ required: true, message: '可用区不能为空', trigger: 'blur' }],
          assetCategory: [{ required: true, message: '资产分类不能为空', trigger: 'blur' }],
          assetStatus: [{ required: true, message: '资产状态不能为空', trigger: 'blur' }],
          unitPrice: [{ required: true, message: '机柜原始原值（元）不能为空', trigger: 'blur' }],
          quantity: [{ required: true, message: '保有量不能为空', trigger: 'blur' }],
          quantityUnit: [{ required: true, message: '保有量单位不能为空', trigger: 'blur' }],
          purchaseTotal: [{ required: true, message: '总原始原值（元）不能为空', trigger: 'blur' }],
          depreciationPeriod: [{ required: true, message: '折旧年限（月）不能为空', trigger: 'blur' }],
          residualValueRate: [{ required: true, message: '残值率不能为空', trigger: 'blur' }],
          monthlyCost: [{ required: true, message: '月成本（元/月）不能为空', trigger: 'blur' }]
          // domain: [{ required: true, message: '所属领域不能为空', trigger: 'blur' }],
          // product: [{ required: true, message: '所属产品不能为空', trigger: 'blur' }],
          // subProduct: [{ required: true, message: '所属子产品不能为空', trigger: 'blur' }]
        },
        模板六: {
          serialNumber: [{ required: true, message: '序列号不能为空', trigger: 'blur' }],
          model: [{ required: true, message: '设备型号不能为空', trigger: 'blur' }],
          techStack: [{ required: true, message: '技术栈不能为空', trigger: 'blur' }],
          region: [{ required: true, message: '地域不能为空', trigger: 'blur' }],
          availabilityZone: [{ required: true, message: '可用区不能为空', trigger: 'blur' }],
          assetCategory: [{ required: true, message: '资产分类不能为空', trigger: 'blur' }],
          assetStatus: [{ required: true, message: '资产状态不能为空', trigger: 'blur' }],
          unitPrice: [{ required: true, message: '机房环境采购单价（元/月）不能为空', trigger: 'blur' }],
          quantity: [{ required: true, message: '保有量不能为空', trigger: 'blur' }],
          quantityUnit: [{ required: true, message: '保有量单位不能为空', trigger: 'blur' }],
          monthlyCost: [{ required: true, message: '采购总价（元/月）不能为空', trigger: 'blur' }]
          // domain: [{ required: true, message: '所属领域不能为空', trigger: 'blur' }],
          // product: [{ required: true, message: '所属产品不能为空', trigger: 'blur' }],
          // subProduct: [{ required: true, message: '所属子产品不能为空', trigger: 'blur' }]
        }
      }
    }
  },
  created () {
    console.log('categories', categories)
  },
  methods: {
    /** 打开弹窗 */
    async open (id) {
      this.clearForm += 1
      this.dialogVisible = true
      this.reset()
      this.assetCategory = []
      console.log('第一次进来的数据值：', this.assetCategory)
      this.dialogTitle = '新增战略成本投入'
      // 修改时，设置数据
      if (id) {
        this.formLoading = true
        try {
          const res = await inputApi.getUnusedCosts(id)
          console.log('取值', res.data.assetCategory.split('/'))
          this.updateRulesForUpdate(res.data.assetCategory.split('/').splice(-1)[0])
          this.formData = res.data
          this.dialogTitle = '修改战略成本投入'
        } finally {
          this.formLoading = false
        }
      } else {
        this.updateRules(this.assetCategory)
      }
      console.log('第一次出去的数据值', this.formData)
      // this.formData = { uniqueAssetCode: '0789', serialNumber: '134125', model: 'B2X456', configSummary: '无', vendorModel: 'IBM', contractNumber: '2436298365', matterNumber: '012345', techStack: 'Java', region: '北京', availabilityZone: '北京', startUseDate: '2024-07-31T16:00:00.000Z', depreciationStartDate: '2024-08-01T16:00:00.000Z', assetCategory: '固定资产', assetSubcategory: '类别1', unitPrice: '12', originalValue: '13', quantity: '23', quantityUnit: '元', totalOriginalValue: '45', residualValueRate: '2%', monthlyCost: '33', assetStatus: '使用中', domain: '生产', product: '资产', subProduct: '信创', pamComponent1: '1', pamComponent2: '2', pamComponent3: '3', specification: '12x12', vendor: '华为', deviceHeight: '23cm', powerConsumption: '2000', remarks: '测试', amortizationStartDate: '2024-07-31T16:00:00.000Z', purchaseTotal: '20000', servicePeriod: '2', localElectricityPrice: '200', cabinetOriginalValue: '200', environmentUnitPrice: '23' }
      if (this.formData.assetCategory) {
        console.log('开始赋值分类:', this.formData.assetCategory)
        this.assetCategory = this.formData.assetCategory.split('/')
      }
    },
    /** 根据硬件类型获取模板规则 */
    getFormRules (value) {
      if (value) {
        const template = templateMapping[value.slice(-1)[0]]
        console.log('template', template)
        this.currentTemplate = template
        return template
      } else {
        return '模板一'
      }
    },
    /** 根据硬件类型获取模板规则 */
    getFormRulesForUpdate (value) {
      if (value) {
        const template = templateMapping[value]
        console.log('template', template)
        this.currentTemplate = template
        return template
      } else {
        return '模板一'
      }
    },
    updateRules (value) {
      this.$nextTick(() => {
        this.formRules = this.rulesDict[this.getFormRules(value)]
      })
    },
    updateRulesForUpdate (value) {
      // 动态更新验证规则
      console.log('使用规则：', value, this.rulesDict[this.getFormRulesForUpdate(value)])
      setTimeout(() => {
        this.formRules = this.rulesDict[this.getFormRulesForUpdate(value)]
      }, 0)
    },
    /** 提交按钮 */
    async submitForm () {
      // 校验主表
      await this.$refs.formRef.validate()
      this.formLoading = true
      try {
        const data = this.formData
        // 修改的提交
        if (data.uniqueAssetCode) {
          // 将日期格式化为字符串
          // data.startUseDate = this.formatDate(data.startUseDate)
          // data.depreciationStartDate = this.formatDate(data.depreciationStartDate)
          // data.amortizationStartDate = this.formatDate(data.amortizationStartDate)
          await inputApi.updateUnusedCosts(data)
          this.$modal.msgSuccess('修改成功')
          this.dialogVisible = false
          this.$emit('success')
          return
        }
        // 添加的提交
        await inputApi.createUnusedCosts(data)
        this.$modal.msgSuccess('新增成功')
        this.dialogVisible = false
        this.$emit('success')
      } finally {
        this.formLoading = false
      }
    },
    handleChange (value) {
      console.log('切换', this.assetCategory)
      // 将value数组用/拼接成字符串
      // if (this.formData.id === undefined) {
      //   this.reset()
      // }
      if (value) {
        this.formData.assetCategory = value.join('/')
        this.updateRules(value)
      }
    },
    cancel () {
      this.dialogVisible = false
      this.clearForm += 1
      this.reset()
    },
    /** 表单重置 */
    reset () {
      this.formData = {
        id: undefined,
        uniqueAssetCode: undefined,
        serialNumber: undefined,
        model: undefined,
        configSummary: undefined,
        vendorModel: undefined,
        contractNumber: undefined,
        matterNumber: undefined,
        techStack: undefined,
        region: undefined,
        availabilityZone: undefined,
        startUseDate: undefined,
        depreciationStartDate: undefined,
        assetCategory: undefined,
        assetSubcategory: undefined,
        unitPrice: undefined,
        originalValue: undefined,
        quantity: undefined,
        quantityUnit: undefined,
        totalOriginalValue: undefined,
        depreciationPeriod: undefined,
        residualValueRate: undefined,
        monthlyCost: undefined,
        assetStatus: undefined,
        domain: undefined,
        product: undefined,
        subProduct: undefined,
        pamComponent1: undefined,
        pamComponent2: undefined,
        pamComponent3: undefined,
        specification: undefined,
        vendor: undefined,
        deviceHeight: undefined,
        powerConsumption: undefined,
        remarks: undefined,
        amortizationStartDate: undefined,
        purchaseTotal: undefined,
        servicePeriod: undefined,
        localElectricityPrice: undefined,
        cabinetOriginalValue: undefined,
        environmentUnitPrice: undefined
      }

      console.log('打印数据值：', this.formData)

      this.resetForm('formRef')
    },
    formatDate (startUseDate) {
      // 格式化成国际通用时间格式
      const date = new Date(startUseDate)
      const year = date.getUTCFullYear()
      const month = String(date.getUTCMonth() + 1).padStart(2, '0')
      const day = String(date.getUTCDate()).padStart(2, '0')
      const hours = String(date.getUTCHours()).padStart(2, '0')
      const minutes = String(date.getUTCMinutes()).padStart(2, '0')
      const seconds = String(date.getUTCSeconds()).padStart(2, '0')
      console.log(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`)
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`
    }
  }
}
</script>
