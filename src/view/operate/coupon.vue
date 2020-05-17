<template>
  <div class="coupon-container">
    <div class="table-container">
      <el-button type="primary" icon="el-icon-plus" @click="handleCreate">添加优惠券</el-button>
      <el-table
        :data="tableData"
        header-row-class-name="tableHeader"
        row-class-name="tableRow"
        style="width: 100%"
      >
        <el-table-column type="index" :index="indexMethod" label="序号"></el-table-column>
        <el-table-column prop="typeDes" label="活动说明"></el-table-column>
        <el-table-column prop="cut" label="金额"></el-table-column>
        <el-table-column prop="startDate" label="开始"></el-table-column>
        <el-table-column prop="endDate" label="结束"></el-table-column>
        <el-table-column prop="use" label="已使用"></el-table-column>
        <el-table-column prop="all" label="已发放"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm
              confirmButtonText="确定"
              cancelButtonText="取消"
              icon="el-icon-info"
              iconColor="red"
              title="确定删除吗？"
              placement="top"
              width="200"
              @onConfirm="handleDelete(scope.row)"
            >
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
            <!-- <el-button type="text" @click="handleDelete(scope.row)">删除</el-button> -->
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px">
        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="请选择">
            <el-option
              v-for="item in couponTypeOptions"
              :key="item.type"
              :label="item.display_name"
              :value="String(item.type)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始" prop="startDate" class="form-item-startDate">
          <el-date-picker v-model="temp.startDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束" prop="endDate" class="form-item-endDate">
          <el-date-picker v-model="temp.endDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="金额" prop="cut" class="form-item-cut">
          <el-input v-model.number="temp.cut" />
        </el-form-item>
        <el-form-item label="说明" prop="typeDes" class="form-item-typeDes">
          <el-input v-model="temp.typeDes" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCoupon, addCoupon } from "@/api/coupon";
const couponTypeOptions = [
  { type: "1", display_name: "全场满减" },
  { type: "2", display_name: "单品立减" }
];
export default {
  data() {
    let checkPrice = (rule, value, callback) => {
      if (value !== 0 && !value) {
        return callback(new Error("不能为空"));
      }
      if (!Number.isInteger(value)) {
        callback(new Error("请输入数字值"));
      } else {
        if (value < 0) {
          callback(new Error("必须是正数"));
        } else {
          callback();
        }
      }
    };
    return {
      count: null,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        edit: "编辑",
        create: "添加"
      },
      couponTypeOptions,
      temp: {
        id: "",
        type: "", //1全场满减 2单品立减
        typeDes: "",
        rule: "",
        cut: "",
        startDate: "",
        endDate: "",
        status: 1,
        img: ""
      },
      rules: {
        type: [{ required: true, message: "类型是必需的", trigger: "blur" }],
        startDate: [
          { required: true, message: "时间是必需的", trigger: "blur" }
        ],
        endDate: [{ required: true, message: "时间是必需的", trigger: "blur" }],
        typeDes: [{ required: true, message: "说明是必需的", trigger: "blur" }],
        cut: [{ validator: checkPrice, required: true, trigger: "blur" }]
      }
    };
  },
  created() {
    this.getCoupon();
  },
  methods: {
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
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleEdit(row) {
      // 弹出弹窗编辑修改商品
      this.dialogFormVisible = true;
      this.setIemp(
        row.id,
        row.type,
        row.typeDes,
        row.cut,
        row.startDate,
        row.endDate
      );
      this.dialogStatus = "edit";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleDelete(row) {
      //   this.deleteSnack(row.id);
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        // valid ? this.addSnack(this.temp) : "";
        if (valid) {
          this.dialogFormVisible = false;
          this.addCoupon(this.temp)
          //   console.log(this.temp)
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
        }
      });
    },
    setIemp(id, type, typeDes, cut, startDat, endDatee) {
      this.temp = {
        id,
        type,
        typeDes,
        cut,
        startDat,
        endDatee
      };
    },
    resetTemp() {
      this.temp = {
        id: "",
        type: "", //1全场满减 2单品立减
        typeDes: "",
        rule: 20,
        cut: "",
        startDate: "",
        endDate: "",
        // status: 1,
        // img: "http://q8fjmlnxd.bkt.clouddn.com/rain-4.png"
        img: "http://http://cdn.qiniu.qzsk.run/rain-4.png"
      };
    },
    getCoupon() {
      getCoupon(this.currentPage, this.pageSize).then(res => {
        this.tableData = res.msg;
        this.count = res.count;
      });
    },
    addCoupon(data) {
      addCoupon(data).then(res => {
        this.getCoupon(this.currentPage, this.pageSize);
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.coupon-container {
  margin: 25px 55px 25px 45px;
  .table-container {
    padding: 25px 30px;
    background-color: #fff;
    .el-table {
      height: calc(100vh - 205px);
    }
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
  .el-dialog__wrapper {
    /deep/ .el-dialog {
      min-width: 400px;
      max-width: 600px;
      /deep/ .el-dialog__body {
        padding: 10px 20px 0 60px;
        .form-item-cut,
        .form-item-typeDes {
          max-width: 290px;
        }
      }
    }
  }
}
</style>