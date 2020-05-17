<template>
  <div class="prop-merchandise-container">
    <div class="table-container">
      <span class="tit">商品分类管理</span>
      <div class="menu-type">
        <el-tag
          :key="menuType"
          v-for="menuType in menuTypes"
          closable
          :disable-transitions="false"
          @close="handleDelete(menuType)"
        >{{menuType}}</el-tag>
        <!-- <el-popconfirm
        :key="menuType"
        v-for="menuType in menuTypes"
        confirmButtonText="确定"
        cancelButtonText="取消"
        icon="el-icon-info"
        iconColor="red"
        title="确定删除吗？"
        placement="top"
        width="200"
        @onConfirm="handleDelete(menuType)"
      >
        <el-button slot="reference" type="primary"><i class="el-icon-remove el-icon--left"></i>{{menuType}}</el-button>
        </el-popconfirm>-->
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        ></el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新类型</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getMenu, addMenu, deleteMenu } from "@/api/merchandise";
export default {
  data() {
    return {
      menuTypes: null,
      inputVisible: false,
      inputValue: "",
      dialogVisible: false
    };
  },
  created() {
    this.getMenu();
  },
  methods: {
    getMenu() {
      getMenu().then(res => {
        let menuTypes = [];
        for (let item of res.data.menu) {
          menuTypes.push(item.type);
        }
        this.menuTypes = menuTypes;
      });
    },
    addMenu(inputValue) {
      const data = { type: inputValue };
      addMenu(data).then(res => {
        this.menuTypes.push(inputValue);
      });
    },
    deleteMenu(menuType) {
      const data = { type: menuType };
      deleteMenu(data).then(res => {
        this.menuTypes.splice(this.menuTypes.indexOf(menuType), 1);
      });
    },
    handleDelete(menuType) {
      this.$confirm("确认删除吗？")
        .then(_ => {
          this.deleteMenu(menuType);
        })
        .catch(_ => {});
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.checkAvailability(this.menuTypes, inputValue)
          ? this.$message.error("分类名称不能重复")
          : this.addMenu(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    checkAvailability(arr, val) {
      return arr.some(arrVal => {
        return val === arrVal;
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.prop-merchandise-container {
  margin: 25px 55px 25px 45px;
  .table-container {
    padding: 25px 30px;
    background-color: #fff;
    height: calc(100vh - 100px);
    .menu-type {
      padding-top: 10px;
      .el-tag {
        margin: 10px 10px 0 0;
      }
      .button-new-tag {
        margin-top: 10px;
        height: 28px;
        line-height: 26px;
        padding-top: 0;
        padding-bottom: 0;
      }
      .input-new-tag {
        width: 90px;
        margin-top: 10px;
        vertical-align: bottom;
      }
    }
  }
}
</style>