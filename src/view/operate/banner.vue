<template>
  <div class="banner-container">
    <div class="table-container">
      <span class="tit">封面广告</span>
      <ul class="advertisement-box">
        <li class="upload-list_item" v-for="(item, index) in banner" :key="index">
          <img :src="item.img" alt />
          <span class="upload-list_item-actions">
            <span class="upload-list_item-delete" @click="removeFileHandle(item, index)">
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </li>
        <input
          class="input-upload"
          type="file"
          id="image_upload"
          name="image_upload"
          accept=".jpg, .jpeg, .png"
          @change="uploadFileHandle"
        />
        <label for="image_upload" class="btn-upload">＋</label>
      </ul>
      <!-- <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>-->

      <!-- <img class="preview" :src="temp.img" alt /> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getBanner, addBanner, deleteBanner } from "@/api/merchandise";

export default {
  data() {
    return {
      banner: [],
      dialogImageUrl: "",
      dialogVisible: false,
      uploadFile: null //上传文件 广告图片
    };
  },
  computed: {
    ...mapGetters(["qn_url"])
  },
  created() {
    this.getBanner();
  },
  methods: {
    getBanner() {
      getBanner().then(res => {
        this.banner = res.data.banner;
      });
    },
    addBanner(img) {
      addBanner({ img }).then(res => {
        const bannerItem = { id: res.data.id, img };
        this.banner.push(bannerItem);
      });
    },
    deleteBanner(id, index) {
      deleteBanner({ id }).then(res => {
        this.banner.splice(index, 1);
      });
    },
    removeFileHandle(item, index) {
      this.$confirm("确认删除吗？")
        .then(async _ => {
          const { code } = await this.$store.dispatch(
            "qiniu/deleteFile",
            item.img
          );
          //先删除七牛空间图片成功之后再删除数据库中的图片
          if (code === 0) this.deleteBanner(item.id, index);
        })
        .catch(_ => {});
    },
    // handlePictureCardPreview(file) {
    //   this.dialogImageUrl = file.url;
    //   this.dialogVisible = true;
    // },
    async uploadFileHandle(e) {
      const file = e.target.files[0];
      if (file) {
        if (!this.checkUploadAvailable()) {
          return this.$message.info("最多上传3张图片");
        }
        if (this.validFile(file)) {
          this.uploadFile = file;
          await this.$store.dispatch("qiniu/getQnToken");
          const { key } = await this.$store.dispatch(
            "qiniu/uploadFile",
            this.uploadFile
          );
          this.addBanner(this.qn_url + key);
        }
      }
    },
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
    // 小程序最多显示3张广告封面
    checkUploadAvailable() {
      return this.banner.length >= 3 ? false : true;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.banner-container {
  margin: 25px 55px 25px 45px;
  .table-container {
    padding: 25px 30px;
    background-color: #fff;
    height: calc(100vh - 100px);
    .advertisement-box {
      display: flex;
      flex-wrap: wrap;
      .upload-list_item {
        position: relative;
        border-radius: 5px;
        margin: 20px 20px 0 0;
        overflow: hidden;
        // background-color: #fff;
        width: 150px;
        height: 150px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
        .upload-list_item-actions {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          cursor: default;
          text-align: center;
          opacity: 0;
          font-size: 20px;
          color: #fff;
          background-color: rgba(0, 0, 0, 0.5);
          transition: opacity 0.3s;
          span {
            cursor: pointer;
          }
          &:hover {
            opacity: 1;
          }
          &:after {
            display: inline-block;
            content: "";
            height: 100%;
            vertical-align: middle;
          }
        }
      }
      .btn-upload {
        margin-top: 20px;
        border-radius: 5px;
        width: 150px;
        height: 150px;
        border: 1px dashed #a3a3a3;
        display: block;
        text-align: center;
        line-height: 150px;
        font-size: 35px;
        font-weight: lighter;
        color: #a3a3a3;
        cursor: pointer;
        &:hover {
          color: #2b2b2b;
          border-color: #2b2b2b;
        }
      }
      .input-upload {
        opacity: 0;
        width: 0px;
        height: 0px;
      }
    }
  }
}
</style>