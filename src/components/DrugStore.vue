<template>
  <div class="wrapper">
    <Stats/>
    <div class="viewPort">
      <div class="layout" ref="layout"><div class="cell" v-for="i in 9" :key=i></div></div>
      <div class="page">
        <div class="item" v-for="item in drugStoreGoods" :style="{backgroundImage:`url(${getImage(item.name)})`}">
          <div class="price">
            <img class='image' src="../assets/coins.png" alt="">
            <div class="number">{{item.price}}</div>
          </div>
          <div class="amount">
            <img class='image' src="../assets/amount.svg" alt="">
            <div class="number">{{item.amount}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="description">
      <div class="descriptionWrapper" v-for="i in Object.keys(description)" v-if="description">
        <div class="line" v-if="i !==`effect`"> {{ $t(`itemsCards.${i}`)+`: `+$t(`itemsCards.${description[i as keyof typeof description]}`) }}</div>
        <!-- <div v-else class="block">
          <div class="line">{{ i+`:` }}</div>
          <div class="line pl" v-for="effect in Object.keys(description[i as keyof typeof description])">
            <div>{{ $t(`itemsCards.${effect}`)+`: `+description[i as keyof typeof description][effect] }}</div>
          </div>
        </div> -->
      </div>
    </div>
    <NavigationBlock v-if="navigationAsist">
      <div>1-9</div>
      <div>{{$t(`assist[3]`)}}</div>
    </NavigationBlock>
  </div>
</template>

<script setup lang="ts">
import {inject,watch,ref,computed}from "vue"
import Stats from "./Stats.vue"
import NavigationBlock from "./NavigationBlock.vue"
import { useStore } from "../stores/store";

const store = useStore()
const layout=ref()
const select=store.returnSelect()
const drugStoreGoods=store.returnDrugStoreGoods()
const images:any=inject(`images`)
const navigationAsist=store.returnNavigationAsist()

watch(select,()=>{
  if(select.value==666){return};
  [...layout.value.children].forEach(i=>i.style.background=`rgba(255,255,255,0.2)`);
  [...layout.value.children][select.value-1].style.background=`rgba(35, 148, 41,0.7)`
})

const description=computed(()=>{
  const {price, amount, ...duplicat} = Object.assign({}, drugStoreGoods[select.value-1])
  return duplicat
})

function getImage(name:string){
  if(typeof name !==`string`)return
  const fullName=name.split(``).filter((i)=>i!==` `&&i!==`%`).join(``)
  return images[`/src/assets/icons/${fullName}.png`].default
}
</script>

<style scoped lang="scss">
.wrapper{
  height: 50%;
  position: relative;
  background-color: rgba(0,0,0,0.7);
  border-radius: 0 0 25px 25px ;
  display: flex;
  padding-right: 10px;
  .viewPort{
    height: 100%;
    aspect-ratio: 1/1;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.5s;
    .page{
      height: 95%;
      aspect-ratio: 1/1;
      border-radius: 20px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 1fr 1fr 1fr;
      gap: 5px;
      z-index: 1;
      .item{
        padding: 10px;
        text-align: center;
        position: relative;
        color: rgb(207, 202, 202);
        background-repeat: no-repeat;
        background-size: auto 70%;
        filter: grayscale(0.4);
        background-position: 50% 50%;
        .price{
          position: absolute;
          bottom: 5px;
          left: 10px;
          display: flex;
          align-items: center;
          .image{
            height: 14px;
            padding-right: 4px;
          }
          .number{
            font-size: 12px;
            padding-top: 2px;
            line-height: normal;
          }
        }
        .amount{
          position: absolute;
          bottom: 5px;
          right: 10px;
          display: flex;
          align-items: center;
          .image{
            height: 12px;
            padding-right: 4px;
          }
          .number{
            font-size: 13px;
            padding-top: 2px;
            line-height: normal;
          }
        }
      }
    }
    .layout{
      position: absolute;
      height: 95%;
      aspect-ratio: 1/1;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 1fr 1fr 1fr;
      gap: 5px;
      .cell{
        background-color: rgba(255,255,255,0.2);
        border-radius: 15px;
        transition: 0.2s;
      }
    }
  }
  .description{
    align-self: center;
    height: 95%;
    aspect-ratio: 1.4/2;
    background-color: rgba(255,255,255,0.2);
    border-radius: 15px;
    padding: 10px;
    .descriptionWrapper{
      color: rgb(207, 202, 202);
      .line{
        padding-bottom: 5px;
      }
      .block{
        .pl{
          padding-left: 10px;
        }
      }
    }
  }
}
</style>
