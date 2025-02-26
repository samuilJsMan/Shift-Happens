<template>
  <div class="wrapper">
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
      <div v-for="i in Object.keys(inventory[currentSide][(page-1)*9+(select-1)])" v-if="inventory[currentSide][(page-1)*9+(select-1)]">
        <div v-if="(typeof inventory[currentSide][(page-1)*9+(select-1)][i] !== `object`)&&(i!=`letter`)&&(i!=`price`)">
          {{ i+`: `+inventory[currentSide][(page-1)*9+(select-1)][i]}}
        </div>
        <div v-else v-for="item in Object.keys(inventory[currentSide][(page-1)*9+(select-1)][i])">
          <div v-if="typeof inventory[currentSide][(page-1)*9+(select-1)][i][item] ==`object`" 
          v-for="it in Object.keys(inventory[currentSide][(page-1)*9+(select-1)][i][item])">
            {{ it+`: `+ inventory[currentSide][(page-1)*9+(select-1)][i][item][it]}}
          </div>
          <div v-else-if="(i!=`letter`)&&(i!=`price`)">
            {{ item+`: `+inventory[currentSide][(page-1)*9+(select-1)][i][item] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {inject,watch,ref,onMounted,reactive }from "vue"
const store:any=inject(`store`)
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

onMounted(()=>{
  maxPages.value=Math.ceil(inventory.items.length/9)||1
})

watch(currentWord,()=>{
  if(currentScreen.value===`Inventory`){
    switch(currentWord.value){
      case `down`:
      if(page.value+1<=maxPages.value){
          nullInventorySelect()
          page.value++   
          transformStyles.height-=100
        }
        break
      case `up`:
        if(page.value>1){
          nullInventorySelect()
          page.value--   
          transformStyles.height+=100
        }
        break  
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
  border-radius: 25px;
  display: flex;
  padding-right: 10px;
  .count{
    position: absolute;
    top: 50%;
    left:-10%;
    transform: translate(0,-50%);
    color: white;
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
    aspect-ratio: 1/2;
    background-color: rgba(255,255,255,0.2);
    border-radius: 15px;
  }
}
</style>
