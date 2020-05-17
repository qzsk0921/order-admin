<template>
  <div class="min-merchandise-container">
    <div class="table-container">
      <el-button type="primary" icon="el-icon-plus" @click="handleCreate">添加副食</el-button>
      <el-table
        :data="tableData"
        header-row-class-name="tableHeader"
        row-class-name="tableRow"
        style="width: 100%"
      >
        <el-table-column type="index" :index="indexMethod" label="序号"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column prop="packing_fee" label="包装费"></el-table-column>
        <!-- <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
            </template>
        </el-table-column>-->
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
        <el-form-item label="名称" prop="name" class="form-item-name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="价格" prop="price" class="form-item-price">
          <el-input v-model.number="temp.price" />
        </el-form-item>
        <el-form-item label="包装费" prop="packing_fee" class="form-item-packing_fee">
          <el-input v-model.number="temp.packing_fee" />
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
import {
  getSnackList,
  addSnack,
  deleteSnack,
  updateSnack
} from "@/api/merchandise";

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
      temp: {
        id: "",
        name: "",
        price: "",
        packing_fee: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        edit: "编辑",
        create: "添加"
      },
      rules: {
        name: [{ required: true, message: "名称是必需的", trigger: "blur" }],
        price: [{ required: true, validator: checkPrice, trigger: "blur" }],
        packing_fee: [{ validator: checkPrice, trigger: "blur" }]
      }
    };
  },
  created() {
    this.getSnackList(this.currentPage, this.pageSize);
  },
  watch: {
    currentPage(nv) {
      this.getSnackList(nv, this.pageSize);
    }
  },
  methods: {
    getSnackList(page, pageSize) {
      getSnackList(page, pageSize).then(res => {
        this.tableData = res.data.snack;
        this.count = res.data.count;
      });
    },
    indexMethod(index) {
      index += (this.currentPage - 1) * this.pageSize + 1;
      if (index < 10) {
        index = "0" + index;
      }
      return index;
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.addSnack(this.temp);
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        // valid ? this.updateSnack(this.temp) : "";
        if (valid) {
          this.dialogFormVisible = false;
          this.updateSnack(this.temp);
        }
      });
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
      this.setIemp(row.id, row.name, row.price, row.packing_fee);
      this.dialogStatus = "edit";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleDelete(row) {
      this.deleteSnack(row.id);
    },
    resetTemp() {
      this.temp = {
        id: "",
        name: "",
        price: "",
        packing_fee: ""
      };
    },
    setIemp(id, name, price, packing_fee) {
      this.temp = {
        id,
        name,
        price,
        packing_fee
      };
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    addSnack(temp) {
      addSnack(temp).then(res => {
        this.getSnackList(this.currentPage, this.pageSize);
      });
    },
    deleteSnack(id) {
      deleteSnack({ id }).then(res => {
        this.getSnackList(this.currentPage, this.pageSize);
      });
    },
    updateSnack(temp) {
      updateSnack(temp).then(res => {
        this.getSnackList(this.currentPage, this.pageSize);
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.min-merchandise-container {
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
      min-width: 300px;
      max-width: 600px;
      /deep/ .el-dialog__body {
        padding: 10px 20px 0 60px;
        .form-item-name,
        .form-item-price,
        .form-item-packing_fee {
          max-width: 290px;
        }
      }
    }
  }
}
</style>