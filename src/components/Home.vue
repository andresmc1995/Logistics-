<template>
  <div class="home">
    <b-container fluid>
    <!-- User Interface controls -->
    <h3>Ver transacciones historicas</h3>
    <b-row>
      <b-col lg="6" class="my-1">
        <b-form-group
          label="Ordenar por"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          label-for="sortBySelect"
          class="mb-0"
        >
         <b-input-group size="sm">
            <b-form-select v-model="sortBy" id="sortBySelect" :options="sortOptions" class="w-75">
              <template v-slot:first>
                <option value="">-- nada --</option>
              </template>
            </b-form-select>
            <b-form-select v-model="sortDesc" size="sm" :disabled="!sortBy" class="w-25">
              <option :value="false">Asc</option>
              <option :value="true">Desc</option>
            </b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col>
     
      <b-col lg="6" class="my-1">
        <b-form-group
          label="Filtrar"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          label-for="filterInput"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
              v-model="filter"
              type="search"
              id="filterInput"
              placeholder="Escribir para buscar"
            ></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Borrar</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col sm="5" md="6" class="my-1">
        <b-form-group
          label="Por pagina"
          label-cols-sm="6"
          label-cols-md="4"
          label-cols-lg="3"
          label-align-sm="right"
          label-size="sm"
          label-for="perPageSelect"
          class="mb-0"
        >
          <b-form-select
            v-model="perPage"
            id="perPageSelect"
            size="sm"
            :options="pageOptions"
          ></b-form-select>
        </b-form-group>
      </b-col>

      <b-col sm="7" md="6" class="my-1">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
        ></b-pagination>
      </b-col>
    </b-row>
   
  <b-table
      show-empty
      small
      stacked="md"
      :items="transaccionesHechasMostrar"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :filterIncludedFields="filterOn"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      @filtered="onFiltered"
    >
    <template v-slot:cell(actions)="row">
        <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
          Mostrar
        </b-button>
        
      </template>

      
    </b-table>
  
<b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <pre>{{ infoModal.content }}</pre>
    </b-modal>
    <!--<b-table  :items="transaccionesHechasMostrar" striped hover></b-table>-->
  </b-container>
 
  </div>
</template>
    
    
    
    
    
    
    
    <!--<b-table  :items="transaccionesHechasMostrar" striped hover></b-table>-->
  
  </div>



</template>

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
        Remito: ${item.remito}
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
        Orden de compra: ${item.ordenCompra}`
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
</style>
