<template>
  <main class="main" @click="deviceMesage">
    <TheRoom></TheRoom>
    <TheUI>{{ word }}</TheUI>
    <transition name="wrongDevice" mode="out-in">
      <WrongDevice class="device" v-if="wrongDevice&&deviceAsist"></WrongDevice>
    </transition>
  </main>
</template>

<script setup lang="ts">
import { provide,onMounted,ref } from "vue";
import { useDisplay } from "vuetify";
import { useStore } from "./stores/store";
import TheRoom from "./components/TheRoom.vue";
import TheUI from "./components/TheUI.vue";
import WrongDevice from "./components/WrongDevice.vue";
const store=useStore()
const display=useDisplay()
const images:any=import.meta.glob('/src/assets/icons/*', {eager:true})
provide(`display`,display)
provide(`store`,store)
provide(`images`,images)
const word=ref(``)
const wrongDevice=ref(false)
const currentWord=store.returnCurrentWord()
const deviceAsist=store.returnDeviceAsist()
const yourTurn=store.returnYourTurn()
const enemies=store.returnEnemies()
const select=store.returnSelect()
const currentScreen=store.returnCurrenScreen()

let deviceShowTimer:any

function keyPress(event:any){
  if((event.keyCode>=65 && event.keyCode<=90)||
  event.keyCode===32||
  event.key.toLowerCase()===`х`||
  event.key.toLowerCase()===`ж`||
  event.key.toLowerCase()===`є`||
  event.key.toLowerCase()===`ї`||
  event.key.toLowerCase()===`б`||
  event.key.toLowerCase()===`ю`||
  event.key===`/`||
  event.key==="`"){
    word.value+=event.key
  }else if(event.key===`Enter`){
    const wordConst=word.value.toLowerCase().trim()
    if(currentScreen.value===`Battle`&&!yourTurn.value&&!(wordConst[0]===`/`||wordConst===`menu`||wordConst===`меню`||enemies[select.value-1][`health`]<=0)){
      word.value=``
      return
    }
    currentWord.value=wordConst
    word.value=``
  }else if(event.key===`Backspace`){
    word.value=word.value.slice(0,-1)
  }else if(!isNaN(event.key)&&event.key!=0){
    store.jerkingSelect(event.key)
  }
  setTimeout(()=>{currentWord.value=``},100)
}

function deviceMesage(){
  wrongDevice.value=true
  clearTimeout(deviceShowTimer)
  deviceShowTimer=setTimeout(()=>{
    wrongDevice.value=false
  },2000)
}

onMounted(()=>{
  document.addEventListener(`keydown`,keyPress)
})
</script>

<style lang="scss">
@font-face{
  font-family: "Press Start 2P";
  src: url(../src/assets/fonts/PressStart2P-Regular.ttf);
}
*{
  font-family: "Press Start 2P", serif;
  user-select: none;
}
.main{
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: black;
  perspective:200px;
  .device{
    width: 200px;
    position: absolute;
    top: 40px;
    left: 50%;
    transform: translate(-50%,0);
  }
}

.wrongDevice-enter-from,.wrongDevice-leave-to{
  opacity: 0;
}
.wrongDevice-leave-from, .wrongDevice-enter-to{
  opacity: 1;
}
.wrongDevice-enter-active,.wrongDevice-leave-active{
  transition: 0.5s;
}
</style>
