<template>
  <div class="wrapper">
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
      <div v-for="i in Object.keys(chestEntries[select-1])" v-if="chestEntries[select-1]">
        <div v-if="(typeof chestEntries[select-1][i] !== `object`)&&(i!=`letter`)">
          {{ i+`: `+chestEntries[select-1][i].toUpperCase()}}
        </div>
        <div v-else v-for="item in Object.keys(chestEntries[select-1][i])">
          <div v-if="typeof chestEntries[select-1][i][item] ==`object`" 
          v-for="it in Object.keys(chestEntries[select-1][i][item])">
            {{ it+`: `+ chestEntries[select-1][i][item][it]}}
          </div>
          <div v-else-if="i!=`letter`">
            {{ item+`: `+chestEntries[select-1][i][item] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {inject,watch,ref}from "vue"
const store:any=inject(`store`)
const layout=ref()
const select=store.returnSelect()
const chestEntries=store.returnChestEntries()
const images:any=inject(`images`)

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
  border-radius: 25px;
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
    aspect-ratio: 1/2;
    background-color: rgba(255,255,255,0.2);
    border-radius: 15px;
  }
}
</style>
