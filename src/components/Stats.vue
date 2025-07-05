<template>
  <div class="stats">
    <div class="startInner">
      <div class="statItem">{{$t(`stats[0]`)}}: {{ stats.healthMax }}</div>
      <div class="statItem">{{$t(`stats[1]`)}}: {{ stats.healthRegen }}</div>
      <div class="statItem">{{$t(`stats[2]`)}}: {{ stats.energyMax }}</div>
      <div class="statItem">{{$t(`stats[3]`)}}: {{ stats.damage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "../stores/store";
const store = useStore()
const stats=store.returnStats()

</script>

<style scoped lang="scss">
.stats{
  position: absolute;
  width: 100%;
  bottom: 100%;
  height: 100px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 25px 25px 0 0;
  padding: 10px 10px 0 10px;
}
.startInner{
  height: 100%;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  display: flex;
  flex-wrap: wrap;
}
.statItem{
  width: 50%;
  padding: 5px 15px ;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: rgb(207, 202, 202);
  font-size: 14px;
}
</style>
