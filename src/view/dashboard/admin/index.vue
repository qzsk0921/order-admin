<template>
  <div class="dashboard-admin-container">
    <button id="logo-doodle-notifier" title="点击查看今日游戏积分">
      <div class="outer ball0">
        <div class="inner"></div>
      </div>
      <div class="outer ball1">
        <div class="inner"></div>
      </div>
      <div class="outer ball2">
        <div class="inner"></div>
      </div>
      <div class="outer ball3">
        <div class="inner"></div>
      </div>
    </button>
    <!-- <span class="title">主页</span> -->
    <!-- <br /> -->
    <!-- <br /> -->
    <!-- <img src="https://cn.bing.com/th?id=OHR.CastleDay_ZH-CN8752542375_1920x1080.jpg&rf=LaDigue_1920x108" alt=""> -->
    <!-- <img src="https://cn.bing.com/th?id=OHR.LaughingOwl_ZH-CN8548558025_1920x1080.jpg&rf=LaDigue_192" alt=""> -->
    <!-- <img src="https://cn.bing.com//th?id=OHR.KasbahRoses_ZH-CN8429310380_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp" alt=""> -->
    <greedy-snake />
  </div>
</template>

<script>
import GreedySnake from "@/components/game/greedy_snake";
export default {
  name: "dashboard-admin",
  components: { GreedySnake },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-admin-container {
  padding: 48px;
  // .title {
  //   color: $menuBg;
  // }
  // img {
  //   // padding-top: 6px;
  //   height: calc(100vh - 146px);
  //   object-fit: cover;
  //   object-position: center;
  // }
  #logo-doodle-notifier {
    background: transparent;
    border: 0;
    cursor: pointer;
    display: inline-block;
    // left: calc(50% + 148px);
    padding: 0;
    position: absolute;
    top: 12px;
    left: 60px;
    width: 24px;
    height: 24px;
    .ball0 {
      animation-delay: 2640ms;
      transform: rotate(45deg);
      .inner {
        background: linear-gradient(
          315deg,
          rgb(0, 85, 221),
          rgb(0, 119, 255),
          rgb(0, 119, 255)
        );
      }
    }
    .ball1 {
      animation-delay: 1760ms;
      transform: rotate(135deg);
      .inner {
        background: linear-gradient(
          225deg,
          rgb(221, 0, 0),
          rgb(238, 51, 51),
          rgb(255, 119, 85)
        );
      }
    }
    .ball2 {
      transform: rotate(225deg);
      .inner {
        background: linear-gradient(
          90deg,
          rgb(0, 119, 68),
          rgb(0, 153, 68),
          rgb(85, 187, 85)
        );
      }
    }
    .ball3 {
      animation-delay: 880ms;
      transform: rotate(315deg);
      .inner {
        background: linear-gradient(
          0deg,
          rgb(255, 170, 51),
          rgb(255, 204, 0),
          rgb(255, 221, 102)
        );
      }
    }
    .inner {
      animation: anim-pos 880ms cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite
        alternate;
      border-radius: 50%;
      height: 100%;
      position: absolute;
      transform: rotate(90deg);
      width: 100%;
    }
    .outer {
      /*animation: anim-z-order 3520ms linear infinite;*/
      height: 37.5%;
      /*left: 50%;*/
      /*margin-inline-start: -18.75%;*/
      /*margin-top: -18.75%;*/
      position: absolute;
      /*top: 50%;*/
      width: 37.5%;
    }
  }
  @keyframes anim-pos {
    0% {
      transform: translate(-98%, 0);
    }
    100% {
      transform: translate(98%, 0);
    }
  }
  @keyframes anim-z-order {
    0% {
      z-index: 100;
    }
    100% {
      z-index: 1;
    }
  }
  button {
    -webkit-writing-mode: horizontal-tb !important;
    text-rendering: auto;
    color: buttontext;
    letter-spacing: normal;
    word-spacing: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    text-align: center;
    cursor: default;
    font: 400 11px system-ui;
    outline: none;
  }
}
</style>
