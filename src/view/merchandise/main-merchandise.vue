<template>
  <div class="main-merchandise-container">
    <!-- <div class="title">商品管理</div> -->
    <div class="table-container">
      <el-button type="primary" icon="el-icon-plus" @click="handleCreate">添加商品</el-button>
      <el-table
        :data="tableData"
        header-row-class-name="tableHeader"
        row-class-name="tableRow"
        style="width: 100%"
      >
        <el-table-column type="index" :index="indexMethod" label="序号"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column prop="typeName" label="类型"></el-table-column>
        <el-table-column prop="img" label="预览" class-name="table-column-img">
          <template slot-scope="scope">
            <img :src="scope.row.img" alt />
          </template>
        </el-table-column>
        <el-table-column label="规格" class-name="table-column-size">
          <template slot-scope="scope">
            <el-popover placement="left-start" trigger="hover">
              {{ scope.row.sizeText }}
              <div slot="reference" class="name-wrapper">{{ scope.row.sizeText }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="温度" class-name="table-column-tem">
          <template slot-scope="scope">
            <el-popover placement="top" trigger="hover">
              {{ scope.row.temText }}
              <div slot="reference" class="name-wrapper">{{ scope.row.temText }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="甜度" class-name="table-column-sugar">
          <template slot-scope="scope">
            <el-popover placement="right-start" trigger="hover">
              {{ scope.row.sugarText }}
              <div slot="reference" class="name-wrapper">{{ scope.row.sugarText }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span type="text" v-if="scope.row.status===1">上架</span>
            <span type="text" v-else>下架</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" class-name="table-column-desc">
          <template slot-scope="scope">
            <el-popover placement="left-start" trigger="hover">
              {{ scope.row.desc }}
              <div slot="reference" class="name-wrapper">{{ scope.row.desc }}</div>
            </el-popover>
          </template>
        </el-table-column>
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

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :before-close="handleDialogClose"
    >
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px">
        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="请选择">
            <el-option
              v-for="item in merchTypeOptions"
              :key="item.id"
              :label="item.type"
              :value="String(item.id)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name" class="form-item-name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="价格" prop="price" class="form-item-price">
          <el-input v-model="temp.price" />
        </el-form-item>
        <el-form-item label="规格" class="form-item-size">
          <el-checkbox-group v-model="temp.size">
            <el-checkbox
              v-for="specs in sizeOptions"
              :label="specs"
              :key="specs"
              :disabled="specs==='常规'"
            >{{specs}}</el-checkbox>
          </el-checkbox-group>
          <!-- <div class="size-extra-price">
            价格:
            <el-input size="mini" v-model="curExtraPrice" placeholder="请输入" />包装费:
            <el-input size="mini" v-model="curExtraPacking_fee" placeholder="请输入" />
          </div>-->
        </el-form-item>
        <el-form-item label="温度">
          <el-checkbox-group :min="1" v-model="temp.tem">
            <el-checkbox v-for="specs in temOptions" :label="specs" :key="specs">{{specs}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="糖度" class="form-item-sugar">
          <el-checkbox-group :min="1" v-model="temp.sugar">
            <el-checkbox v-for="specs in sugarOptions" :label="specs" :key="specs">{{specs}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item class="form-item-upload">
          <input
            class="input-upload"
            type="file"
            id="image_upload"
            name="image_upload"
            accept=".jpg, .jpeg, .png"
            @change="updateImageDisplay"
          />
          <label for="image_upload" class="el-button--primary btn-upload">选择要上载的图像</label>
          <img class="preview" :src="temp.img" alt />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择">
            <el-option
              v-for="item in statusOptions"
              :key="item.status"
              :label="item.display_name"
              :value="item.status"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" class="form-item-desc">
          <el-input
            v-model="temp.desc"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入"
          />
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
  getfoodList,
  deleteFood,
  addFood,
  updateFood,
  getSnackList
} from "@/api/merchandise";
import { mapGetters } from "vuex";
import { Loading } from "element-ui";

// const merchTypeOptions = [
//   { type: "1", display_name: "泰潮系列" },
//   { type: "2", display_name: "泰高冷系列" },
//   { type: "3", display_name: "泰好喝系列" },
//   { type: "4", display_name: "泰咖系列" },
//   { type: "5", display_name: "泰特别系列" },
//   { type: "6", display_name: "泰炫彩系列" },
//   { type: "7", display_name: "象丸系列" }
// ];
// const sizeOptions = ["常规", "珍珠", "花生蛋糕酱", "西米", "椰果", "布丁"];
const temOptions = ["常规冰", "多冰", "少冰", "去冰", "热", "温"];
const sugarOptions = ["常规糖", "半糖", "微糖", "不另外加糖"];
const defaultSize = { specs: "常规", price: 0, packing_fee: 0 };

export default {
  data() {
    return {
      count: null,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      search: null,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        edit: "编辑",
        create: "添加"
      },
      rules: {
        type: [{ required: true, message: "类型是必需的", trigger: "change" }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        name: [{ required: true, message: "名称是必需的", trigger: "blur" }],
        price: [{ required: true, message: "价格是必需的", trigger: "blur" }]
      },
      merchTypeOptions: [],
      statusOptions: [
        { status: 0, display_name: "下架" },
        { status: 1, display_name: "上架" }
      ],
      temp: {
        id: "",
        desc: "",
        name: "",
        price: "",
        type: "",
        status: 1,
        img: "",
        size: ["常规"],
        tem: ["常规冰"],
        sugar: ["常规糖"]
      },
      sizeOptions: ["常规"], //小食种类
      temOptions, //温度种类
      sugarOptions, //糖度种类
      snackList: null, //包括小食种类的各个参数
      uploadFile: null, //上传文件 商品图片
      oldFile: null //原图片url(上传新文件之后需删除老文件，节省七牛空间资源)
      // objectURL: "" //对象的URL,一个DOMString
    };
  },
  created() {
    this.getfoodList(this.currentPage, this.pageSize);
  },
  computed: {
    ...mapGetters(["qn_url"])
  },
  watch: {
    currentPage(nv) {
      this.getfoodList(nv, this.pageSize);
    }
  },
  methods: {
    // 获取主食列表
    getfoodList(page, pageSize) {
      getfoodList(page, pageSize)
        .then(res => {
          const data = res.data;
          let foodList = JSON.parse(JSON.stringify(data.foods));
          let newFoodList = [];
          // 设置商品分类选项（form表单中）
          this.merchTypeOptions = data.menuMap;
          data.menuMap.forEach(menu => {
            //开源节流,移除遍历过的food
            foodList = foodList.filter((food, ind) => {
              if (food.type == menu.id) {
                food.typeName = menu.type;

                if (food.size) {
                  let specs = "";
                  const foodSize = JSON.parse(food.size);
                  food.size = foodSize.map((it, ind) => {
                    if (ind === foodSize.length - 1) {
                      specs += it.specs;
                    } else {
                      specs += it.specs + "、";
                    }
                    return it.specs;
                  });
                  food.sizeText = specs;
                } else {
                  food.size = ["常规"];
                  food.sizeText = "常规";
                }

                if (food.tem) {
                  let specs = "";
                  const foodTem = JSON.parse(food.tem);
                  food.tem = foodTem.map((it, ind) => {
                    if (ind === foodTem.length - 1) {
                      specs += it.specs;
                    } else {
                      specs += it.specs + "、";
                    }
                    return it.specs;
                  });
                  food.temText = specs;
                } else {
                  food.tem = ["常规冰"];
                  food.temText = "常规冰";
                }

                if (food.sugar) {
                  let specs = "";
                  const foodSugar = JSON.parse(food.sugar);
                  food.sugar = foodSugar.map((it, ind) => {
                    if (ind === foodSugar.length - 1) {
                      specs += it.specs;
                    } else {
                      specs += it.specs + "、";
                    }
                    return it.specs;
                  });
                  food.sugarText = specs;
                } else {
                  food.sugar = ["常规糖"];
                  food.sugarText = "常规糖";
                }
                newFoodList.push(food);
                return false;
              }
              return true;
            });
          });

          if (this.count !== data.count) this.count = data.count;

          this.tableData = newFoodList;
        })
        .catch(err => {});
    },
    // 获取小食列表
    getSnackList() {
      getSnackList().then(res => {
        this.snackList = res.data.snack;
        const sizeOptions = this.snackList.map(item => item.name);
        this.sizeOptions = this.sizeOptions.concat(sizeOptions);
      });
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
    handleEdit(row) {
      this.uploadFile = null;
      // 小食列表，用于小食多选框显示
      if (!this.snackList) {
        this.getSnackList();
      }
      // 不管内存中有没有继续保留对这个文件的引用，都尝试释放 URL对象
      URL.revokeObjectURL(this.temp.img);
      // 弹出弹窗编辑修改商品
      this.dialogFormVisible = true;
      this.setIemp(
        row.id,
        row.desc,
        row.name,
        row.price,
        row.status,
        row.type,
        row.img,
        row.size,
        row.tem,
        row.sugar
      );
      //保存老图片的地址，为提交之后删除文件做准备
      this.oldFile = row.img;

      this.dialogStatus = "edit";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleDelete(row) {
      deleteFood(row.id).then(res => {
        this.$message({
          message: res.msg,
          type: "success"
        });
        this.getfoodList(this.currentPage, this.pageSize);
      });
    },
    handleCreate() {
      // 小食列表，用于小食多选框显示
      if (!this.snackList) {
        this.getSnackList();
      }
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    setIemp(id, desc, name, price, status, type, img, size, tem, sugar) {
      this.temp = {
        id,
        desc,
        name,
        price,
        status,
        type,
        img,
        size,
        tem,
        sugar
      };
    },
    resetTemp() {
      this.temp = {
        id: "",
        desc: "",
        name: "",
        price: "",
        status: 1,
        type: "",
        img: "",
        size: ["常规"],
        tem: ["常规冰"],
        sugar: ["常规糖"]
      };
    },
    updateImageDisplay(e) {
      const file = e.target.files[0];
      // if (!file) {
      //   // 浏览器在 document 卸载的时候，会自动释放它们，但是为了获得最佳性能和内存使用状况，应该在安全的时机主动释放掉它们。
      //   URL.revokeObjectURL(this.temp.img);
      //   this.temp.img = "";
      //   this.uploadFile = null;
      // } else {
      //   if (this.validFile(file)) {
      //     URL.revokeObjectURL(this.temp.img);
      //     this.temp.img = URL.createObjectURL(file);
      //     this.uploadFile = file;
      //   }
      // }
      if (file && this.validFile(file)) {
        URL.revokeObjectURL(this.temp.img);
        this.temp.img = URL.createObjectURL(file);
        this.uploadFile = file;
      }
    },
    // validFileType(file) {
    //   const fileTypes = ["image/jpeg", "image/pjpeg", "image/png"];
    //   return fileTypes.includes(file.type);
    // },
    // returnFileSize(number) {
    //   if (number < 1024) {
    //     return number + "bytes";
    //   } else if (number >= 1024 && number < 1048576) {
    //     return (number / 1024).toFixed(1) + "KB";
    //   } else if (number >= 1048576) {
    //     return (number / 1048576).toFixed(1) + "MB";
    //   }
    // },
    validFile(file) {
      const fileTypes = ["image/jpeg", "image/pjpeg", "image/png"];
      const isJPG = fileTypes.includes(file.type);

      // const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    createData() {
      this.$refs["dataForm"].validate(async valid => {
        if (valid) {
          if (this.uploadFile) {
            this.temp.img = await this.uploadFileHandle();
          }

          this.temp.size = JSON.stringify(this.formatSizeData());
          this.temp.tem = JSON.stringify(this.formatData(this.temp.tem));
          this.temp.sugar = JSON.stringify(this.formatData(this.temp.sugar));

          addFood(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.getfoodList(this.currentPage, this.pageSize);
            this.$notify({
              title: "Success",
              message: "添加成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(async valid => {
        if (valid) {
          if (this.uploadFile) {
            this.temp.img = await this.uploadFileHandle();
          }

          this.temp.size = JSON.stringify(this.formatSizeData());
          this.temp.tem = JSON.stringify(this.formatData(this.temp.tem));
          this.temp.sugar = JSON.stringify(this.formatData(this.temp.sugar));
          // const tempData = Object.assign({}, this.temp);
          // tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateFood(this.temp).then(() => {
            // const index = this.list.findIndex(v => v.id === this.temp.id);
            // this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.getfoodList(this.currentPage, this.pageSize);
            // this.$notify({
            //   title: "Success",
            //   message: "更新成功",
            //   type: "success",
            //   duration: 2000
            // });

            //删除老文件
            this.removeOldFileHandle();
          });
        }
      });
    },
    // 格式化规格
    formatSizeData() {
      const checkedSizes = this.temp.size;
      let tempSnackList = this.snackList;
      let tempSize = [defaultSize]; //snackList里没有常规类，默认带上

      checkedSizes.forEach(value => {
        tempSnackList = tempSnackList.filter(snack => {
          if (value === snack.name) {
            let size = {
              specs: value,
              price: snack.price,
              packing_fee: snack.packing_fee
            };
            tempSize.push(size);
            return false;
          }
          return true;
        });
      });
      return tempSize;
    },
    // 格式化糖度和温度
    formatData(checkedData) {
      let fData = [];
      checkedData.forEach(value => {
        const temp = {
          specs: value,
          price: 0,
          packing_fee: 0
        };
        fData.push(temp);
      });
      return fData;
    },
    async uploadFileHandle() {
      await this.$store.dispatch("qiniu/getQnToken");
      const { key } = await this.$store.dispatch(
        "qiniu/uploadFile",
        this.uploadFile
      );
      return this.qn_url + key;
    },
    handleDialogClose() {
      // 清URL对象
      URL.revokeObjectURL(this.temp.img);
      // 清file对象
      this.uploadFile = null;
      this.dialogFormVisible = false;
    },
    // 去七牛空间删除
    removeOldFileHandle() {
      this.$store.dispatch("qiniu/deleteFile", this.oldFile);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/style/mixin.scss";
// @deep: ~'>>>';

.main-merchandise-container {
  margin: 25px 55px 25px 45px;
  // .title {
  //   color: $menuBg;
  // }
  .table-container {
    padding: 25px 30px;
    background-color: #fff;
    .el-table {
      height: calc(100vh - 205px);
      /deep/.table-column-size,
      .table-column-tem,
      .table-column-sugar,
      .table-column-desc {
        div {
          @include one-txt-cut;
        }
      }
      /deep/ .table-column-img {
        img {
          height: 50px;
          width: 50px;
          object-fit: cover;
          object-position: center;
        }
      }
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
      margin-top: 5vh !important;
      /deep/ .el-dialog__body {
        padding: 10px 20px 0 60px;
        .form-item-name,
        .form-item-price {
          width: 60%;
          .el-input__inner {
            border-radius: 0;
            border-right: 0;
            border-left: 0;
            border-top: 0;
            padding-left: 0;
          }
        }
        .form-item-desc {
          width: 80%;
        }
        .form-item-sugar {
          margin-bottom: 0;
        }
        .form-item-upload {
          margin-bottom: 10px;
          /deep/ .el-form-item__content {
            display: flex;
            height: 76px;
            align-items: center;
            justify-content: flex-start;
            .btn-upload {
              padding: 0 10px;
              border-radius: 5px;
              margin-right: 40px;
            }
            .input-upload {
              opacity: 0;
              width: 0px;
              height: 0px;
            }
            .preview {
              width: auto;
              max-height: 76px;
              object-fit: contain;
            }
          }
        }
      }
    }
  }
}
</style>