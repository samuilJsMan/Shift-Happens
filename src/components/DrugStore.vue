<template>
  <div class="wrapper">
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
      <div v-for="i in Object.keys(drugStoreGoods[select-1])" v-if="drugStoreGoods[select-1]">
        <div v-if="typeof drugStoreGoods[select-1][i] !== `object`&&i!==`price`&&i!==`amount`">
          {{ i+`: `+drugStoreGoods[select-1][i]}}
        </div>
        <div v-else v-for="item in Object.keys(drugStoreGoods[select-1][i])">
          <div v-if="typeof drugStoreGoods[select-1][i][item] ==`object`" 
          v-for="it in Object.keys(drugStoreGoods[select-1][i][item])">
            {{ it+`: `+ drugStoreGoods[select-1][i][item][it]}}
          </div>
          <div v-else>
            {{ item+`: `+drugStoreGoods[select-1][i][item] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {inject,watch,ref}from "vue"
const store:any=inject(`store`)
const currentWord=store.returnCurrentWord()
const currentScreen=store.returnCurrenScreen()
const layout=ref()
const select=store.returnSelect()
const drugStoreGoods=store.returnDrugStoreGoods()
const images:any=inject(`images`)
const stats=store.returnStats()

watch(currentWord,()=>{
  if(currentScreen.value===`DrugStore`){
    switch(currentWord.value){
      case "buy":
        const good=drugStoreGoods[select.value-1]
        if(good&&stats.gold.value>=good.price&&good.amount>0){
          good.amount--
          stats.gold.value-=good.price
          console.log(good)
          switch(good.name){
            case `heal 20%`:
              stats.health.value+=(stats.healthMax.value*0.2)
              if(stats.health.value>stats.healthMax.value){
                stats.health.value=stats.healthMax.value
              }
            break
            case `heal 50%`:
              stats.health.value+=(stats.healthMax.value*0.5)
              if(stats.health.value>stats.healthMax.value){
                stats.health.value=stats.healthMax.value
              }
            break
            case `heal full`:
              stats.health.value=stats.healthMax.value
            break
            case `increase health 10`:
              stats.healthMax.value+=10
              stats.health.value+=10
            break
            case `increase health 25`:
              stats.healthMax.value+=25
              stats.health.value+=25
            break
            case `increase health 50`:
              stats.healthMax.value+=50
              stats.health.value+=50
            break
            case `increase energy 1`:
              stats.energyMax.value+=1
              stats.energy.value+=1
            break
            case `increase energy 2`:
              stats.energyMax.value+=2
              stats.energy.value+=2
            break
            case `increase energy 5`:
              stats.energyMax.value+=5
              stats.energy.value+=5
            break
            case `increase regen 2`:
              stats.healthRegen.value+=2
            break
            case `increase regen 5`:
              stats.healthRegen.value+=5
            break
            case `increase regen 10`:
              stats.healthRegen.value+=10
            break
            case `increase damage 2`:
              stats.damage.value+=2
            break
            case `increase damage 5`:
              stats.damage.value+=5
            break
            case `increase damage 10`:
              stats.damage.value+=10
            break
            
          }
        }
      break
    }
  }
})

watch(select,()=>{
  if(select.value==666){return}
  nullInventorySelect();
  [...layout.value.children][select.value-1].style.background=`rgba(35, 148, 41,0.7)`
})

function nullInventorySelect(){
  [...layout.value.children].forEach(i=>i.style.background=`rgba(255,255,255,0.2)`)
}
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
    aspect-ratio: 1/2;
    background-color: rgba(255,255,255,0.2);
    border-radius: 15px;
  }
}
</style>
