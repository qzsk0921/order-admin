<template>
  <div class="refund-container">
    <!-- <div class="title">退款管理</div> -->
    <div class="table-container">
      <el-table
        :data="tableData"
        header-row-class-name="tableHeader"
        row-class-name="tableRow"
        style="width: 100%"
      >
        <el-table-column type="index" :index="indexMethod" label="序号"></el-table-column>
        <el-table-column prop="orderId" label="订单ID"></el-table-column>
        <el-table-column prop="sumMoney" label="金额"></el-table-column>
        <el-table-column prop="desc" label="原因"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDialogFormVisible(scope.row)">确认退款</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="count"
        background
      ></el-pagination>
    </div>
    <el-dialog
      title="确认退款"
      :visible.sync="dialogFormVisible"
      width="40%"
      center
      :before-close="handleClose"
    >
      <el-form :model="form[orderIndex]" :rules="rules" ref="ruleForm">
        <el-form-item label="退款类型：" prop="payType">
          <el-select v-model="form[orderIndex].payType" placeholder="支付宝">
            <el-option label="微信" value="wechat"></el-option>
            <el-option label="支付宝" value="alipay"></el-option>
            <el-option label="银行卡" value="bankcard"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退单流水：" prop="desc">
          <el-input type="textarea" v-model.number="form[orderIndex].desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel('ruleForm')" class="nopass" style="margin-right: 30px">取 消</el-button>
        <el-button
          type="primary"
          @click="confirm('ruleForm')"
          class="pass"
          style="margin-left: 30px"
        >确 认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="确认退款"
      :visible.sync="dialogMsgVisible"
      width="40%"
      class="dialogMsgVisible"
      :before-close="handleClose"
    >
      <div style="text-align: center">
        <img src="#" style="width: 100%" />
        <span class="confirmSuccess">确认退款成功</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { getRefundList } from "@/api/order";

export default {
  data() {
    return {
      count: null,
      tableData: [],
      cartList: [],
      currentPage: 1,
      pageSize: 10,
      dialogFormVisible: false,
      dialogMsgVisible: false,
      dialogTitle: null,
      rules: {
        payType: [
          { required: true, message: "请选择支付方式", trigger: "change" }
        ],
        desc: [
          { required: true, message: "请填写流水号", trigger: "blur" },
          { type: "number", message: "流水号必须为数字", trigger: "blur" }
          // { type: 'number', message: '流水号必须为数字', trigger: 'blur change' }
        ]
      },
      // 假设每页十条待退款数据，那么对应有十条退款内容表单数据
      // 实现关闭对话框时，保留对应表单的输入痕迹，而不是所有表单共用
      form: [
        {
          payType: "",
          desc: ""
        },
        {
          payType: "",
          desc: ""
        },
        {
          payType: "",
          desc: ""
        },
        {
          payType: "",
          desc: ""
        },
        {
          payType: "",
          desc: ""
        },
        {
          payType: "",
          desc: ""
        },
        {
          payType: "",
          desc: ""
        },
        {
          payType: "",
          desc: ""
        },
        {
          payType: "",
          desc: ""
        },
        {
          payType: "",
          desc: ""
        }
      ],
      orderIndex: 0
    };
  },
  created() {
    this.getRefundList(this.currentPage, this.pageSize);
  },
  watch: {
    currentPage(nv) {
      this.getRefundList(nv, this.pageSize);
    }
  },
  methods: {
    getRefundList(page, pageSize) {
      this.tableData = [
        {
          orderId: "20193019210232",
          desc: "搬家",
          sumMoney: 21
        },
        {
          orderId: "20193019212222",
          desc: "搬家2",
          sumMoney: 22
        },
        {
          orderId: "20193019212242",
          desc: "搬家4",
          sumMoney: 23
        }
      ];
      // getRefundList(page, pageSize)
      //   .then(res => {
      //     const data = res.data;
      //     if (!this.count) {
      //       this.count = data.count;
      //     }
      //     this.tableData = data.list;
      //   })
      //   .catch(err => {});
    },
    indexMethod(index) {
      index += (this.currentPage - 1) * this.pageSize + 1;
      if (index < 10) {
        index = "0" + index;
      }
      return index;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handleDialogFormVisible(row) {
      // 弹出弹窗编辑修改商品
      this.dialogFormVisible = true;
    },
    confirm(formName) {
      this.$refs[formName].validate(rules => {
        if (rules) {
          // alert('submit!')
          this.dialogFormVisible = false;
          // 请求接口上传支付类型和流水号
          this.dialogMsgVisible = true;
          // this.form.payType
          setTimeout(() => {
            this.dialogMsgVisible = false;
          }, 1500);
          this.$refs[formName].resetFields();
          // 1、发送给后台调用成功后 2、切换（已退款）按钮 3、重新请求待退款接口（也可下次点击待退款再请求）
          this.orderObj.orderStatus = "refunded";
          // console.log(this.orderObj)
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    handleClose(done) {
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
      // this.form[this.orderIndex].payType = this.form.payType
      // this.form[this.orderIndex].desc = this.form.desc
      this.$refs.ruleForm.clearValidate();
      done();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.refund-container {
  margin: 25px 55px 25px 45px;
  .title {
    color: $menuBg;
  }
  .table-container {
    padding: 25px 30px;
    background-color: #fff;
    .el-pagination {
      padding-top: 25px;
      text-align: right;
      .el-pager li {
        &:hover {
          color: $menuBg;
        }
      }
      .el-pager li.active {
        &:hover {
          color: #fff;
        }
        background-color: $menuBg;
      }
    }
  }
}
</style>