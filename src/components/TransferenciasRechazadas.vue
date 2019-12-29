<template>
  <div class="home">
<h3>Ver balance</h3>
  <b-form-group
        id="input-group-1"
        label-for="input-1"
        label="Elegir empresa:"
      >
        <b-form-select 
          id="input-1" size="sm"
          v-model="empresaActual"
          :options="listaEmails"
          type="email"
          required
          placeholder="Elegir empresa"
        ></b-form-select>
      </b-form-group>
  <p>Total que envie a la otra empresa: {{envMio}}</p><br>
  <p>Total que la otra empresa me envio: {{envOtro}}</p><br>
  <p>Total que recibi de la otra empresa: {{recMio}}</p><br>
  <p>Total que la otra empresa recibio de mi: {{recOtro}}</p>
  <b-card><div class="bg-secondary text-light"><p id="bage">Balance general: {{recMio-recOtro}}</p></div></b-card>
  </div>
</template>
    
    
    
    
    
    
    
    <!--<b-table  :items="transaccionesHechasMostrar" striped hover></b-table>-->
  
  

<script>
import Firebase from 'firebase'
import config from '../config'
import {app} from '../App'
import {db} from '../App'
import {EventBus} from '../main'
let transaccionesHechasRef = db.ref('transaccionesHechas')
let usuariosRef=db.ref('usuarios')


export default {
  name: 'Home',
  data:()=>({transaccionesHechas:[],usuario:'', empresaActual:'',usuarios:[],
  fields: [
          { key: 'cantidadEnviada', label: 'CANTIDAD ENV', sortable: true, sortDirection: 'desc' },
          { key: 'cantidadRecibida', label: 'CANTIDAD REC', sortable: true, class: 'text-center' },
          {
            key: 'enviador',
            label: 'QUIEN ENVIA',
            
            sortable: true,
            sortByFormatted: true,
            filterByFormatted: true
          },
          { key: 'fechaEnviada', label: 'FECH ENV', sortable: true },
          { key: 'fechaRecibida', label: 'FECH REC', sortable: true },
          { key: 'recibidor', label: 'QUIEN RECIBE',
          sortable: true,
            sortByFormatted: true,
            filterByFormatted: true },
            { key: 'actions', label: 'Mas informacion' }
        ],
  totalRows: 1,
        currentPage: 1,
        perPage: 5,
        pageOptions: [5, 10, 15],
        sortBy: '',
        sortDesc: false,
        sortDirection: 'asc',
        filter: null,
        filterOn: [],
        infoModal: {
          id: 'info-modal',
          title: '',
          content: ''
        }}),
  computed:{transaccionesHechasMostrar:function(){
    return this.transaccionesHechas.filter(function(transaccion){
      return transaccion.enviador==Firebase.auth().currentUser.email || transaccion.recibidor==Firebase.auth().currentUser.email
    })
  },
  sortOptions() {
        // Create an options list from our fields
        return this.fields
          .filter(f => f.sortable)
          .map(f => {
            return { text: f.label, value: f.key }
          })
      },
      envMio(){
        return this.transaccionesHechasMostrar.filter(transaccion=>{return transaccion.enviador==Firebase.auth().currentUser.email && transaccion.recibidor== this.empresaActual  }).map((hola)=>hola.cantidadEnviada).reduce((a,b)=>{
          return parseInt(a)+parseInt(b)
        },0)
      },
      envOtro(){
        return this.transaccionesHechasMostrar.filter(transaccion=>{return transaccion.enviador==this.empresaActual && transaccion.recibidor== Firebase.auth().currentUser.email }).map((hola)=>hola.cantidadEnviada).reduce((a,b)=>{
          return parseInt(a)+parseInt(b)
        },0)
      },
      recMio(){
        return this.transaccionesHechasMostrar.filter(transaccion=>{return transaccion.enviador==this.empresaActual && transaccion.recibidor== Firebase.auth().currentUser.email }).map((hola)=>hola.cantidadRecibida).reduce((a,b)=>{
          return parseInt(a)+parseInt(b)
        },0)
      },
      recOtro(){
        return this.transaccionesHechasMostrar.filter(transaccion=>{return transaccion.enviador==Firebase.auth().currentUser.email && transaccion.recibidor==this.empresaActual  }).map((hola)=>hola.cantidadRecibida).reduce((a,b)=>{
          return parseInt(a)+parseInt(b)
        },0)
      },
     
      
      
      listaEmails:function(){
        let hola = this.usuarios.map(element => {
          return element.email;
        });
        return hola.filter((email)=>{
          return email!==Firebase.auth().currentUser.email;
        })
      }
      

      },
      mounted(){
        this.totalRows = this.transaccionesHechasMostrar.length
        console.log(this.totalRows)
      },
  methods:{
    onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      info(item, index, button) {
        this.infoModal.title = `Fila: ${index}`
        this.infoModal.content = `
        Cantidad enviada: ${item.cantidadEnviada}
        Cantidad recibida: ${item.cantidadRecibida}
        Comentario: ${item.comentario}
        Recibidor: ${item.recibidor}
        Enviador: ${item.enviador}
        Fecha enviada: ${item.fechaEnviada}
        Fecha recibida: ${item.fechaRecibida}
        DNI chofer: ${item.dniChofer}
        Patente chofer: ${item.patenteChofer}
        Nombre del chofer: ${item.nombreChofer}
        Orden de compra: ${item.ordenCompra}
        Remito: ${item.remito}`
        this.$root.$emit('bv::show::modal', this.infoModal.id, button)
      },
      resetInfoModal() {
        this.infoModal.title = ''
        this.infoModal.content = ''
      },
  },
 /* mounted(){
    for (let i=0;i<transaccionesHechas.length;i++){
      transaccionesHechas[i]['fechaEnviada']=transaccionesHechas[i]['fechaEnviada'].toString();
      transaccionesHechas[i]['fechaEnviada']=transaccionesHechas[i]['fechaEnviada'].toString();
    }
  },*/
  firebase:{
    transaccionesHechas:transaccionesHechasRef,
    usuarios:usuariosRef
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
p{
  font-size: 18px;
}
#bage{
  text-align:center;
}
</style>