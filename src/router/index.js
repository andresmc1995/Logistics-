import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login' 
import Transferencias from '@/components/Transferencias'
import TransferenciasOtros from '@/components/TransferenciasOtros'
import TransferenciasRechazadas from '@/components/TransferenciasRechazadas'
import Enviar from '@/components/Enviar'
import Firebase from 'firebase'
import config from '../config'
import {app} from '../App'
import {db} from '../App'
import {EventBus} from '../main'
Vue.use(Router)

const router = new Router({
  routes:[
    {
      path:'*',
      redirect:'/login'
    },
    {
      path:'/',
      redirect:'/login'
    },
    {
      path:'/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta:{
        autentificado:true
      }
    },
    {
      path:'/encurso',
      name:'Transferencias',
      component:Transferencias,
      meta:{
        autentificado:true
      }
    },
    {
      path:'/encurso2',
      name:'TransferenciasOtros',
      component:TransferenciasOtros,
      meta:{
        autentificado:true
      }
    },
    {
      path:'/rechazadas',
      name:'TransferenciasRechazadas',
      component:TransferenciasRechazadas,
      meta:{
        autentificado:true
      }
    },
    {
      path:'/enviar',
      name:'Enviar',
      component:Enviar,
      meta:{
        autentificado:true
      }
    }
  ]
})

router.beforeEach((to,from,next)=>{
  let usuario = Firebase.auth().currentUser;
  let autorizacion = to.matched.some(record=>record.meta.autentificado);

  if(autorizacion && !usuario){
    next('login');
  }else if(!autorizacion && usuario){
    next('home');
  }else{
    next();
  }

})
export default router
