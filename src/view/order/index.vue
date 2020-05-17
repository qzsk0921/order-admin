<template>
  <div class="order-container">
    <!-- <div class="title">订单管理</div> -->
    <div class="table-container">
      <el-table
        :data="tableData"
        header-row-class-name="tableHeader"
        row-class-name="tableRow"
        style="width: 100%"
      >
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="model" label="类型">
          <template slot-scope="scope">
            <span type="text" v-if="scope.row.model==0">到店</span>
            <span type="text" v-else>预约</span>
          </template>
        </el-table-column>
        <el-table-column label="时态">
          <template slot-scope="scope">
            <span type="text" v-if="scope.row.model==0">马上</span>
            <span type="text" v-else>{{scope.row.appointTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cartList" label="商品">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDialogTableVisible(scope.row.cartList)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="cathNumber" label="取餐号"></el-table-column>
        <el-table-column prop="sumNumber" label="数量"></el-table-column>
        <el-table-column prop="sumMoney" label="金额"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-popconfirm
              v-if="scope.row.status===1"
              title="已完成，提醒客人取餐"
              width="250"
              placement="top"
              @onConfirm="handleComfirmStatus(scope.row)"
            >
              <el-button slot="reference" type="text">待完成</el-button>
            </el-popconfirm>
            <!-- <el-button type="text" v-if="scope.row.status===1" @click="handleComfirmVisible(scope.row.cartList)">待完成</el-button> -->
            <span type="text" v-else-if="scope.row.status===2">已完成</span>
            <span type="text" v-else-if="scope.row.status===0">已退款</span>
            <span type="text" v-else>待退款</span>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="时间" width="135"></el-table-column>
        <el-table-column prop="orderId" label="ID" width="155"></el-table-column>
        <el-table-column label="备注" class-name="table-column-note">
          <template slot-scope="scope">
            <el-popover placement="left-start" trigger="hover">
              {{ scope.row.note }}
              <div slot="reference" class="name-wrapper">{{ scope.row.note }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" :loading="scope.row.printing" @click="handlePrint(scope.row)">打印</el-button>
            <!-- <el-button type="text" @click="handleEdit(scope.row)">打印</el-button> -->
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
    <el-dialog :visible.sync="dialogTableVisible" :title="dialogTitle" top="15vh">
      <el-table header-row-class-name="tableHeader" row-class-name="tableRow" :data="cartList">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="number" label="数量"></el-table-column>
        <el-table-column prop="optionDescFormat" label="详情"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderList, updateOrderStatus, printfOrder } from "@/api/order";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      count: null,
      tableData: [],
      cartList: [],
      currentPage: 1,
      pageSize: 10,
      dialogTableVisible: false,
      dialogTitle: null
    };
  },
  created() {
    this.getOrderList(this.currentPage, this.pageSize);
  },
  computed: {
    ...mapGetters(["ws_msg"])
  },
  watch: {
    currentPage(nv) {
      this.getOrderList(nv, this.pageSize);
    },
    ws_msg(dataObj) {
      // let data = dataFormat.split("#")[0];
      const { orderId, status } = dataObj;
      if (orderId) {
        //用管理员更新订单状态（饮品制作完成或已退款）通过数据绑定局部更新
        for (let iterator of this.tableData) {
          if (iterator.orderId === orderId) {
            iterator.status = dataObj.status;
            break;
          }
        }
      } else {
        //用户下单重新请求更新订单页
        this.getOrderList(this.currentPage, this.pageSize);
      }
    }
  },
  methods: {
    getOrderList(page, pageSize) {
      getOrderList(page, pageSize)
        .then(res => {
          const data = res.data;
          if (!this.count) {
            this.count = data.count;
          }
          // 添加printing属性 打印btn加loading用
          let myTableData = JSON.parse(JSON.stringify(data.list));
          for (let iterator of myTableData) {
            iterator.printing = false;
          }
          this.tableData = myTableData;
        })
        .catch(err => {});
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
    handleDialogTableVisible(cartList) {
      // 弹出弹窗编辑修改商品
      this.dialogTableVisible = true;
      this.dialogTitle = "订单详情";
      this.cartList = cartList;
    },
    handleComfirmStatus(row) {
      let orderId = row.orderId;
      updateOrderStatus({
        orderId: orderId,
        status: 2 //0退款 1待制作 2已完成
      }).then(res => {
        if (res.code === 0) {
          row.status = 2;
        }
      });
    },
    handlePrint(row) {
      row.printing = true;
      this.printfOrder(row)
    },
    printfOrder(order) {
      printfOrder(order).then(res=>{
        order.printing = false;
      }).catch(err=>{
        order.printing = false;
      })
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/style/mixin.scss";

.order-container {
  margin: 25px 55px 25px 45px;
  .title {
    color: $menuBg;
  }
  .table-container {
    padding: 25px 20px;
    background-color: #fff;
    .el-table {
      height: calc(100vh - 205px);
      /deep/.table-column-note {
        div {
          @include one-txt-cut;
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
}
</style>