<template>
  <div class="wrapper">
    <Stats/>
    <div class="count">{{ page+`/`+maxPages }}</div>
    <div class="viewPort" ref="viewPort">
      <div class="items type" ref="pageItems">
        <div class="pageWrapper" v-for="page in Math.ceil(inventory.items.length/9)||1" :key="page">
          <div class="layout"><div class="cell" v-for="i in 9" :key=i></div></div>
          <div class="page">
            <div class="item" v-for="i in 9" :key="i" :style="{backgroundImage:`url(${getImage(inventory.items[(page-1)*9+(i-1)]?.name)})`}">
              <div class="amount" v-if="inventory.items[(page-1)*9+(i-1)]">
                <img class='image' src="../assets/amount.svg" alt="">
                <div class="number">{{inventory.items[(page-1)*9+(i-1)].amount}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="cards type" ref="pageCards">
        <div class="pageWrapper" v-for="page in Math.ceil(inventory.cards.length/9)||1" :key="page">
          <div class="layout"><div class="cell" v-for="i in 9" :key=i></div></div>
          <div class="page">
            <div class="item" v-for="i in 9" :key="i">
              <div class="itemWrapper"  v-if="inventory.cards[(page-1)*9+(i-1)]">
                <div class="letter">
                  {{ inventory.cards[(page-1)*9+(i-1)].letter.toUpperCase() }}
                </div>
              </div>
              <div class="itemWrapper" v-for="item in inventory.cards[(page-1)*9+(i-1)].effect"  v-if="inventory.cards[(page-1)*9+(i-1)]">
                <div :class="[`background`,{bad:item.type[0]===`-`}]" :style="{backgroundImage:`url(${getImage(item.type)})`}"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="description">
      <div class="descriptionWrapper" v-for="i in Object.keys(description)" v-if="description&&currentSide===`items`">
        <div class="line" v-if="i ===`heal`||i ===`energy`||i ===`damage`"> {{ $t(`itemsCards.${i}`)+`: `+ description[i]}}</div>
          <div class="line" v-else-if="i !==`effect`"> {{ $t(`itemsCards.${i}`)+`: `+ $t(`itemsCards.${description[i as keyof typeof description]}`)}}</div>
          <div v-else class="block">
          <div class="line">{{ $t(`itemsCards.${i}`)+`:` }}</div>
          <div class="line pl" v-for="effect in Object.keys(description[i] as {} )">
            <div v-if="effect===`type`" >{{ $t(`itemsCards.${effect}`)+`: `+$t(`itemsCards.${(description[i] as any)[effect]}`) }}</div>
            <div v-else>{{ $t(`itemsCards.${effect}`)+`: `+(description[i] as any)[effect] }}</div>
          </div>
        </div>
      </div>
      <div class="descriptionWrapper" v-for="i in Object.keys(description as {})" v-else>
        <div class="line" v-if="i !==`effect`">{{ $t(`itemsCards.${i}`)+`: `+((description as typeof description)[i as keyof typeof description] as string).toUpperCase() }}</div>
        <div v-else class="block" v-for="effect in (description as typeof description)[i as keyof typeof description]">
          <div class="line">{{ $t(`itemsCards.${i}`)+`:` }}</div>
          <div class="line pl" v-for="item in  Object.keys(effect as {})">
            <div v-if="item===`type`" >{{ $t(`itemsCards.${item}`)+`: `+$t(`itemsCards.${(effect as any)[item]}`) }}</div>
            <div v-else >{{ $t(`itemsCards.${item}`)+`: `+(effect as any)[item] }}</div>
          </div>
        </div>
      </div>
    </div>
    <NavigationBlock v-if="navigationAsist">
      <div>1-9</div>
      <div>{{$t(`assist[6]`)}}</div>
      <div>{{$t(`assist[7]`)}}</div>
      <div>{{$t(`assist[8]`)}}</div>
      <div>{{$t(`assist[9]`)}}</div>
      <div>{{$t(`assist[10]`)}}</div>
    </NavigationBlock>
  </div>
</template>

<script setup lang="ts">
import {inject,watch,ref,onMounted,reactive,computed }from "vue"
import Stats from "./Stats.vue"
import NavigationBlock from "./NavigationBlock.vue"
import { useStore } from "../stores/store";
const store = useStore()
const currentWord=store.returnCurrentWord()
const currentScreen=store.returnCurrenScreen()
const inventory=store.returnInventory()
const viewPort=ref()
const pageItems=ref()
const pageCards=ref()
const page=ref(1)
const maxPages=ref()
const transformStyles=reactive({height:0,width:0})
const select=store.returnSelect()
const currentSide=ref(`items`)
const slots=store.returnSlots()
const images:any=inject(`images`)
const navigationAsist=store.returnNavigationAsist()

onMounted(()=>{
  maxPages.value=Math.ceil(inventory.items.length/9)||1
})

const description=computed(()=>{
  const item=inventory[currentSide.value as keyof typeof inventory][(page.value-1)*9+(select.value-1)]
  const {price, amount, ...duplicat}=Object.assign({},item) as any
  return duplicat
})

watch(currentWord,()=>{
  if(currentScreen.value===`Inventory`){
    switch(currentWord.value){
      case `вниз`:
      case `down`:
      if(page.value+1<=maxPages.value){
          nullInventorySelect()
          page.value++   
          transformStyles.height-=100
        }
        break
      case `вгору`:
      case `up`:
        if(page.value>1){
          nullInventorySelect()
          page.value--   
          transformStyles.height+=100
        }
        break  
      case `предмети`:
      case `items`:
        nullInventorySelect()
        page.value=1
        maxPages.value=Math.ceil(inventory.items.length/9)||1
        transformStyles.width=0
        transformStyles.height=0
        pageCards.value.style.opacity=`0`
        pageItems.value.style.opacity=`1`
        currentSide.value=`items`
        break
      case `карти`:
      case `cards`:
        nullInventorySelect()
        page.value=1
        maxPages.value=Math.ceil(inventory.cards.length/9)||1
        transformStyles.width=-100
        transformStyles.height=0
        pageItems.value.style.opacity=`0`
        pageCards.value.style.opacity=`1`
        currentSide.value=`cards`
        break  
       case `слот`:
       case `slot`:
        if(currentSide.value===`items`&&inventory.items[(page.value-1)*9+(select.value-1)]) {
          if(slots.find((i:any)=>i.name===inventory.items[(page.value-1)*9+(select.value-1)].name))return
          if(slots.length>=2)slots.pop()
          slots.unshift(inventory.items[(page.value-1)*9+(select.value-1)])
        }
        break 
    }
  }
})

watch(transformStyles,()=>{
  viewPort.value.style.transform=`translate(${transformStyles.width}%,${transformStyles.height}%)`
})

watch(select,()=>{
  if(select.value==666){return}
  nullInventorySelect();
  const items=[...viewPort.value.children][0].children[page.value-1];
  if(items){[...items.children[0].children][select.value-1].style.background=`rgba(35, 148, 41,0.7)`}
  const cards=[...viewPort.value.children][1].children[page.value-1];
  if(cards){[...cards.children[0].children][select.value-1].style.background=`rgba(35, 148, 41,0.7)`}
})

function nullInventorySelect(){
  if(select.value==666){return}
  const items=[...viewPort.value.children][0].children[page.value-1];
  if(items){[...items.children[0].children].forEach(i=>i.style.background=`rgba(255,255,255,0.2)`)}
  const cards=[...viewPort.value.children][1].children[page.value-1];
  if(cards){[...cards.children[0].children].forEach(i=>i.style.background=`rgba(255,255,255,0.2)`)}
}

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
  .count{
    position: absolute;
    top: 50%;
    left:-10%;
    transform: translate(0,-50%);
    color: white;
  }
  .stats{
    position: absolute;
    width: 100%;
    bottom: 100%;
    height: 100px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 25px 25px 0 0;
    padding: 10px 10px 0 10px;
    .startInner{
      height: 100%;
      width: 100%;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 15px;
      display: flex;
      flex-wrap: wrap;
      .statItem{
        width: 50%;
        padding: 5px 15px ;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: rgb(207, 202, 202);
      }
    }
  }
  .viewPort{
    height: 100%;
    aspect-ratio: 1/1;
    position: relative;
    transition: 0.5s;
    .cards{
      .item{
        display: flex;
        flex-wrap: wrap;
        font-size: 30px;
        color: rgb(207, 202, 202);
        justify-content: space-evenly;
        align-items: start;
        filter: grayscale(0.4);
        .itemWrapper{
          width: 50%;
          height: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 5px;
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
    .type{
      transition: 0.5s;
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .pageWrapper{
      height: 100%;
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
        position: relative;
        .item{
          position: relative;
          background-repeat: no-repeat;
          background-size: auto 70%;
          background-position: 50% 50%;
          color: rgb(207, 202, 202);
          filter: grayscale(0.4);
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
    .cards{
      opacity: 0;
      transform: translate(100%);
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
