<template>
   <div class="intro" ref="intro">
      <div class="text">
        SunFlower14
      </div>
      <div class="smaller">
        {{$t(`intro`)}}
      </div>
   </div>
</template>

<script setup lang="ts">
import {inject,ref} from "vue"
import { useStore } from "../stores/store";
const store = useStore()
const display:any=inject(`display`)
const currentScreen:any=store.returnCurrenScreen()
const intro=ref()
setTimeout(()=>{if(currentScreen.value===`Intro`){
  const platform=display.platform.value
  if(platform.android||platform.ios){
    currentScreen.value=`ForbiddenDevice`
  }else{
    currentScreen.value=`StartMenu`
  }
  }},3500)
</script>

<style scoped lang="scss">
  .intro{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .text{  
    font-size: 50px;
    color: rgb(196, 214, 80);
    width: fit-content;
    margin-bottom: 30px;
  }
  .smaller{
    font-size: 25px;
    color: white;
    width: fit-content;
  }
</style>
