<template>
  <div class="wrapper">
    <Stats/>
    <div class="viewPort">
      <div class="layout" ref="layout"><div class="cell" v-for="i in 9" :key=i></div></div>
      <div class="page">
        <div class="item" v-for="card in chestEntries">
          <div class="itemWrapper">
            <div class="letter">
              {{ card.letter.toUpperCase() }}
            </div>
          </div>
          <div class="itemWrapper" v-for="item in card.effect" >
            <div :class="[`background`,{bad:item.type[0]===`-`}]" :style="{backgroundImage:`url(${getImage(item.type)})`}"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="description">
      <div class="descriptionWrapper" v-for="i in Object.keys(description)" v-if="description">
        <div class="line" v-if="i !==`effect`">{{ $t(`itemsCards.${i}`)+`: `+(description[i as keyof typeof description] as string).toUpperCase() }}</div>
        <div v-else class="block" v-for="effect in description[i]">
          <div class="line">{{ $t(`itemsCards.${i}`)+`:` }}</div>
          <div class="line pl" v-for="item in  Object.keys(effect)">
            <div v-if="item===`type`" >{{ $t(`itemsCards.${item}`)+`: `+$t(`itemsCards.${effect[item]}`) }}</div>
            <div v-else >{{ $t(`itemsCards.${item}`)+`: `+effect[item as keyof typeof effect] }}</div>
          </div>
        </div>
      </div>
    </div>
    <NavigationBlock v-if="navigationAsist">
      <div>1-9</div>
      <div>{{$t(`assist[1]`)}}</div>
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
const chestEntries=store.returnChestEntries()
const images:any=inject(`images`)
const navigationAsist=store.returnNavigationAsist()

const description=computed(()=>{
  const duplicat=Object.assign({},chestEntries[select.value-1])
  return duplicat
})

watch(select,()=>{
  if(select.value==666){return};
  [...layout.value.children].forEach(i=>i.style.background=`rgba(255,255,255,0.2)`);
  [...layout.value.children][select.value-1].style.background=`rgba(35, 148, 41,0.7)`
})

function getImage(name:string){
  if(typeof name !==`string`)return
  let fullName=name.split(``).filter((i)=>i!==` `&&i!==`%`).join(``)
  if(fullName===`-miss`){fullName=`miss`}
  if(fullName===`-weakness`){fullName=`weakness`}
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
}
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
      display: flex;
      flex-wrap: wrap;
      font-size: 30px;
      color: rgb(207, 202, 202);
      justify-content: space-evenly;
      align-items: start;
      .itemWrapper{
        width: 50%;
        height: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px;
        filter: grayscale(0.4);
        .background{
          height: 100%;
          width: 100%;
          background-repeat: no-repeat;
          background-size: contain;
          background-position: 50% 50%;
        }
      }
      .bad{
        border: 2px solid rgb(221, 48, 48);
        border-radius: 10px;
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
</style>
