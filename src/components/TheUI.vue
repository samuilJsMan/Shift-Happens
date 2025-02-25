<template>
  <div class="screen">
    <transition name="menu">
      <div class="ui" v-if="isStarted">
        <div class="mainStats">
          <div class="slots">
            <div class="slot">
              <div class="overflow" :style="{backgroundImage:`url(${getImage(slots[0]?.name)})`}">
              </div>
              <div class="leftItem">
                {{ slots[0]?.amount||0 }}
              </div>
            </div>
            <div class="slot">
              <div class="overflow" :style="{backgroundImage:`url(${getImage(slots[1]?.name)})`}">
              </div>
              <div class="leftItem">
                {{ slots[1]?.amount||0 }}
              </div>
            </div>
            <div class="slot">
              <div class="overflow">
                <img src="../assets/reload.svg" >
              </div>
              <div class="leftItem">
                {{ stats.reloads }}
              </div>
            </div>
            <div class="slot">
              <div class="overflow">
                <img src="../assets/coins.png"  class="coins">
              </div>
              <div class="leftItem">
                {{ stats.gold }}
              </div>
            </div>
          </div>
          <div class="stats">
            <div class="numbers">
              <div class="energy">{{stats.energy.value}}</div>
              <div class="health">{{stats.health.value}}</div>
            </div>
            <div class="bars">
              <div class="energy">
                <div class="filler" :style="{'width':`${100/stats.energyMax.value*stats.energy.value}%`}"></div>
              </div>
              <div class="health">
                <div class="filler" :style="{'width':`${100/stats.healthMax.value*stats.health.value}%`}"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="ammo">
          <transition name="ammo">
            <div class="fightAsist" v-if="currentScreen===`Battle`">
              <transition name="fade">
              <div class="check" v-if="fightAsist">
                <div class="bage" v-for="effect in calcAttack(list[0]).effect" :style="{backgroundImage:`url(${getImage(effect[`type`])})`,border:effect[`type`][0]===`-`?`1px solid red`:``}" :key="Math.random()">
                  <div class="stat">{{effect[`duration`]}}</div>
                  <div :class="[`stat`,{bad:effect[`type`][0]===`-`}]">{{emit(effect)||`0`}}</div>
                </div>
              </div>
              </transition>
            </div>
          </transition>
          <transition name="ammo">
            <div class="words" v-if="currentScreen===`Battle`">
              <TransitionGroup name="bulets">
                <div class="word" v-for="i in list" :key="i">
                  {{ i }}
                </div>
              </TransitionGroup>
            </div>
          </transition>
          <transition name="ammo">
            <div class="copper"  v-if="currentScreen===`Battle`" ></div>
          </transition>
        </div>
      </div>
    </transition>
    <transition name="hit">
      <div class="hitBlast" v-if="hitBlast"></div>
    </transition>
    <transition name="menu" mode="out-in">
      <div class="menuDarkened" v-if="componentList[currentScreen]">
        <transition name="menu" mode="out-in">
          <component :is="componentList[currentScreen]"/>
        </transition>
      </div>
    </transition>
    <div class="wordLine">
      <div class="words">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {inject,watch} from "vue"
import StartMenu from "./StartMenu.vue"
import Inventory from "./Inventory.vue"
import Chest from "./Chest.vue"
import Death from "./Death.vue"
import DrugStore from "./DrugStore.vue"
import Help from "./Help.vue"
import Menu from "./Menu.vue"
import Shop from "./Shop.vue"
import Credits from "./Credits.vue"
import Options from "./Options.vue"
import Tutorial from "./Tutorial.vue"
const store:any=inject(`store`)
const images:any=inject(`images`)
const hitBlast=store.returnHitBlast()
const currentScreen:any=store.returnCurrenScreen()
const isStarted:any=store.returnIsStarted()
const componentList:any={StartMenu,Inventory,Chest,Death,DrugStore,Help,Menu,Shop,Credits,Options,Tutorial}
const fightAsist:any=store.returnFightAsist()
const list:any=store.returnList()
const currentWord:any=store.returnCurrentWord()
const stats=store.returnStats()
const yourTurn=store.returnYourTurn()
const slots=store.returnSlots()
const language:any=store.returnLanguage()
const isAlive=store.returnIsAlive()
const cards=store.returnInventory().cards
const enemies=store.returnEnemies()
const select=store.returnSelect()

watch(list,()=>{
  fightAsist.value=false
  setTimeout(()=>{
  fightAsist.value=true
  },500)
  while(list.length<7){
    const randomString=Math.floor(Math.random()*store.wordLists[language.value].length)
    if(list.includes(store.wordLists[language.value][randomString]))continue
    list.push(store.wordLists[language.value][randomString])
  }
})

watch(isStarted,()=>{
  list.splice(0, list.length)
})

watch(currentWord,()=>{

  if(currentScreen.value===`Battle`&&yourTurn.value){
    if(currentWord.value===`reload`&&stats.reloads.value>0&&stats.energy.value>0){
      list.splice(0, list.length)
      stats.energy.value--
      stats.reloads.value--
    }
    if(currentWord.value===list[0]&&stats.energy.value>0){
      list.shift()
      stats.energy.value--
      let calculatedAttack=calcAttack(currentWord.value).effect
      const miss:any=calculatedAttack.find((item:any)=>item.type==="-miss")
      const splash:any=calculatedAttack.find((item:any)=>item.type==="splash")
      let damage=stats.damage.value

      calculatedAttack.forEach((effect:any)=>{
        switch (effect.type){
          case `crit`:
            damage+=Math.floor(stats.damage.value/100*effect[`amplification`])
            delete calculatedAttack[calculatedAttack.indexOf(effect as never)]
            break
          case `-weakness`:
            damage+=Math.ceil(stats.damage.value/100*effect[`damage`])
            delete calculatedAttack[calculatedAttack.indexOf(effect as never)]
            break
          case `heal`:
            if(stats.health.value+effect[`heal`]>stats.healthMax.value){
              stats.health.value=stats.healthMax.value
            }else{
              stats.health.value+=effect[`heal`]
            }
            delete calculatedAttack[calculatedAttack.indexOf(effect as never)]
            break
          case `energy`:
            stats.energy.value++
            if(stats.energy.value+effect[`energy`]>stats.energyMax.value){
              stats.energy.value=stats.energyMax.value
            }else{
              stats.energy.value+=effect[`energy`]
            }
            delete calculatedAttack[calculatedAttack.indexOf(effect as never)]
            break
          case `-energy`:
            if(+stats.energy.value+effect[`energy`]<0){
              stats.energy.value=0
            }else{
              stats.energy.value+=effect[`energy`]
            }
            delete calculatedAttack[calculatedAttack.indexOf(effect as never)]
            break
        }
      })

      if(miss){
        if(miss.miss>Math.random()*100){return}
        delete calculatedAttack[calculatedAttack.indexOf(miss as never)]
      }

      enemies[select.value-1].health-=damage

      if(splash){
        enemies.forEach((enemy:any)=>{
          enemy.health-=Math.floor(damage/100*splash[`splash`])
        })
        calculatedAttack.splice(calculatedAttack.indexOf(splash as never),1)
      }

      calculatedAttack=calculatedAttack.filter(() => true)
      console.log(calculatedAttack)
      calculatedAttack.forEach((effect:any)=>setEffect(effect))
    }
    const find:any=slots.find((item:any)=>item?.name===currentWord.value)
    if(yourTurn.value&&find){
      if(find.name===`grenade`&&stats.energy.value>0){
        stats.energy.value--
        find.amount--
        enemies.forEach((enemy:any)=>enemy.health-=find.damage)
      }else if(find.name===`molotov`&&stats.energy.value>0){
        stats.energy.value--
        find.amount--
        setEffect(find.effect,true)
      }else if(find.name===`flash`&&stats.energy.value>0){
        stats.energy.value--
        find.amount--
        setEffect(find.effect,true)
      }else if(find.name===`smoke`&&stats.energy.value>0){
        stats.energy.value--
        find.amount--
        setEffect(find.effect,true)
      }else if(find.name===`gas`&&stats.energy.value>0){
        stats.energy.value--
        find.amount--
        setEffect(find.effect,true)
      }else if(find.name===`medkit`||find.name===`heal potion`){
        stats.health.value=stats.health.value+find.heal>stats.healthMax.value?stats.healthMax.value:stats.health.value+find.heal
        find.amount--
      }else if(find.name===`energy drink`||find.name===`energy potion`){
        stats.energy.value=stats.energy.value+find.heal>stats.energyMax.value?stats.energyMax.value:stats.energy.value+find.energy
        find.amount--
      }    
    }
  }
}) 

watch(isAlive,()=>{
  if(isAlive.value===false){
    currentScreen.value=`Death`
  }
})

function setEffect(effect:any,global?:boolean){
  console.log(effect)
  function setInner(enemy:any){
    const find=enemy.effects.find((enemyEffect:any)=>enemyEffect.type===effect.type)
    if(find){
      Object.keys(find).forEach((item:any)=>{
        if(item===`type`)return
        if(Math.abs(find[item])<Math.abs(effect[item])){
          (find as any)[item]=effect[item]
        }
      })
    }else{
      enemy.effects.push(Object.assign({},effect))
    }
  }
  if(global){
    enemies.forEach((argument:any)=>{setInner(argument)})
  }else{
    setInner(enemies[select.value-1])
  }
}
function calcAttack(word:string){
  const exit={effect:[]}
  cards.forEach((card:any)=>{
    if(word.includes(card.letter)){
      card.effect.forEach((effect:any)=>{
        const find=exit.effect.find((item:any)=>{
          return item?.type===effect.type
        })
        if(find){
          Object.keys(find).forEach((item:any)=>{
            if(item===`type`)return
            if((find as any).type[0]===`-`){
              if(Math.abs(find[item])>Math.abs(effect[item])){
                (find as any)[item]=effect[item]
              }
            }else{
              if(Math.abs(find[item])<Math.abs(effect[item])){
                (find as any)[item]=effect[item]
              }
            }
          })
        }else{
          exit.effect.push(effect as never)
        }
      })
    }
  })
  return exit
}
function emit(effect:any){
  const duplicat=Object.assign({},effect)
  delete duplicat.type
  delete duplicat.duration
  return Object.values(duplicat)[0]
}
function getImage(name:string){
  if(typeof name !==`string`||name===``)return
  const fullName=name.split(``).filter((i)=>i!==` `&&i!==`%`&&i!==`-`).join(``)
  return images[`/src/assets/icons/${fullName}.png`].default
}
</script>

<style scoped lang="scss">
.screen{
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  .ui{
    position: absolute;
    height: 100%;
    width: 100%;
    color:white;
    display: flex;
    align-items: end;
    justify-content: space-between;
    .mainStats{
      width: 100%;
      height: fit-content;
      gap: 10px;
      padding: 10px;
      max-width: 300px;
      margin-right: 400px;
      .stats{
        height: fit-content;
        display: flex;
        gap: 10px;
        .bars{
          flex-grow: 1;
          display: flex;
          justify-content: space-around;
          flex-direction: column;
          >*{
            width: 100%;
            height: 16px;
            border: 1px solid black;
            border-radius: 8px;
            overflow: hidden;
            background-color: rgba(0,0,0,0.6);
          }
          .filler{
            transition:0.3s;
            height: 100%;
          }
          .energy{
            .filler{background-color: rgb(28, 28, 209);}
          }
          .health{
            .filler{background-color: rgb(190, 32, 32);}
          }
        }
        .numbers{
          flex-grow: 0;
          display: flex;
          justify-content: space-around;
          flex-direction: column;
          text-align: right;
          .energy{
            color: rgb(28, 28, 209);
          }
          .health{
            color: rgb(190, 32, 32);
          }
        }
      }
      .slots{
        width: 100%;
        height: 50px;
        display: flex;
        gap: 5px;
        margin-bottom: 5px;
        .slot{
          background-color: rgba(0,0,0,0.6);
          border: 1px solid rgba(255,255,255,0.6);
          height: 100%;
          aspect-ratio: 1/1;
          border-radius: 50%;
          position:relative;
          .overflow{
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-repeat: no-repeat;
            background-size: auto 90%;
            background-position: 50% 50%;
            filter: grayscale(0.4);
            img{
              display: block;
              margin: 0 auto;
              height: 100%;
            }
            .coins{
              height: 80%;
              object-position: center;
            }
          }
          .leftItem{
            position: absolute;
            bottom: 0;
            left: 70%;
            font-size: 14px;
          }
        }
      }
    }
    .ammo{
      width: 100%;
      height: 300px;
      position: relative;
      max-width: 300px;
      display: flex;
      .fightAsist{
        width: 105px;
        flex-shrink: 0;
        height: fit-content;
        align-self: flex-end;
        display: flex;
        padding-bottom: 5px;
        .check{
          display: flex;
          align-self: flex-end;
          flex-wrap: wrap;
          .bage{
            width: 50px;
            height: 50px;
            background-color: rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            background-repeat: no-repeat;
            background-size: auto 100%;
            background-position: 50% 50%;
            display: flex;
            flex-direction: column;
            justify-content: end;
            .stat{
              font-size: 13px;
              line-height: normal;
              color: rgb(0, 198, 17);
              text-align: right;
            }
            .bad{
              color: rgb(198, 0, 0);
            }
          }
        }
      }
      .words{
        width: 100%;
        height: 100%;
        padding-top: 5px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items:flex-start;
        .word{
          width: 100%;
          border: 1px solid black;
          border-right: none;
          height: 40px;
          margin-bottom: 3px;
          border-radius: 7px 0px 0px 7px ;
          background: linear-gradient(to bottom, 
          rgb(71, 71, 71) 0%,
          rgb(99, 71, 44) 15%,
          rgb(119, 70, 26) 50%,
          rgb(99, 71, 44) 85%,
          rgb(71, 71, 71) 100%);
          text-align: center;
          font-size: 12px;
          padding: 10px;
        }
      }
      .copper{
        top: 0;
        right: 0;
        position: absolute;
        margin-left: auto;
        width: 50%;
        height: 100%;
        clip-path: polygon(0% 90%, 0% 100%, 100% 100%, 100% 0%, 85% 0%);
        background-color:rgba(17, 17, 24, 0.7);
      }
    }
  }
  .wordLine{
    height: 50px;
    border-radius: 3px;
    border: 3px solid rgb(45, 61, 46);
    width: 400px;
    overflow: hidden;
    padding: 10px;
    background-color: rgba(0,0,0,0.4);
    position: absolute;
    bottom: 0;
    left:50%;
    transform: translate(-50%, 0);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-weight: bold;
    color: rgb(168, 166, 133);
    font-size: 20px;
    .words{
      margin: 0 auto;
    }
  }
  .hitBlast{
    background-color: rgb(255,255,255,0.2);
    position: absolute;
    height: 100%;
    width: 100%;
  }
  .menuDarkened{
    background-image: radial-gradient(rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%);
    position: absolute;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hit-enter-from, .hit-leave-to{
    opacity: 0;
  }
  .hit-enter-to, .hit-leave-from{
    opacity: 1;
  }
  .hit-enter-active, .hit-leave-active{
    transition: 0.02s;
  }

  .menu-enter-from,.menu-leave-to{
    opacity: 0;
  }
  .menu-leave-from, .menu-enter-to{
    opacity: 1;
  }
  .menu-enter-active,.menu-leave-active{
    transition: 0.5s;
  }

  .ammo-enter-from,.ammo-leave-to{
    transform: translate(0,100%);
  }
  .ammo-leave-from, .ammo-enter-to{
    transform: translate(0,0);
  }
  .ammo-enter-active,.ammo-leave-active{
    transition: 0.5s;
  }

  .bulets-leave-to{
    animation:bulets 1s forwards;
  }

  .fade-enter-from,.fade-leave-to{
    opacity: 0;
  }
  .fade-leave-from, .fade-enter-to{
    opacity: 1;
    transition-delay: 0.5s;
  }
  .fade-enter-active,.fade-leave-active{
    transition-duration: 0.5s;
  }

  @keyframes bulets {
    50%{
      transform: translate(100% ,0);
      margin-top: 0px;
    }
    100%{
      transform: translate(100%,0);
      margin-top: -43px;
    }
  }
}
</style>
