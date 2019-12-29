<template>
  <div class="home">
    <h3>Recibos pendientes</h3>
  <b-container fluid>
    <!-- User Interface controls -->
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
      :items="transaccionesEnCursoOtrosMostrar"
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
      <template v-slot:cell(CANT_ACEPTADA)="data">
        <b-input-group >
               <b-form-input size="sm" v-model="cantAceptadas[data.item['.key']]"></b-form-input>
               
             <b-button size="sm"  @click="hola(cantAceptadas[data.item['.key']],data.item,comentario[data.item['.key']])">Aceptar</b-button>   
             </b-input-group> 
</template>
<!--.modal-prevent-closing-->
<template v-slot:cell(actions)="row">
        <b-button size="sm" @click="chau(row.item['.key'])">
          Editar
        </b-button>
        
      </template>

      
        
        

      <template v-slot:cell(actions2)="raw">
        <b-button size="sm" @click="info(raw.item, raw.index, $event.target)" class="mr-1">
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

<script>
import Firebase from 'firebase'
import config from '../config'
import {app} from '../App'
import {db} from '../App'
import {EventBus} from '../main'
import Vue from 'vue'
import VueSweetalert2 from 'vue-sweetalert2'
Vue.use(VueSweetalert2);


let transaccionesEnCursoRef = db.ref('transaccionesEnCurso')
let transaccionesRechazadasRef=db.ref('transaccionesRechazadas')
let transaccionesHechasRef = db.ref('transaccionesHechas')

let esNumeroCaracter=(c)=>{
  return (c=='0' || c=='1' || c=='2' || c=='3' || c=='4' || c=='5' || c=='61' || c=='7' || c=='8' || c=='9') 
}
let esEntero = function(arreglo){
  for(let i=0;i<=arreglo.length;i++){
    if(!esNumeroCaracter(i)){
      return false
    }
  }
return true
}
export default {
  name: 'Home',
  data:()=>({transaccionesEnCurso:[],usuario:'', cantAceptadas:{}, enviarAHome:{}, enviarARechazadas:{}, comentario:{}, file2:[],
  fields: [
          { key: 'cantidadEnviada', label: 'CANTIDAD ENV', sortable: true, sortdirection: 'desc' },
          {
            key: 'enviador',
            label: 'QUIEN ENVIA',
            
            sortable: true,
            sortByFormatted: true,
            filterByFormatted: true
          },
          { key: 'fechaEnviada', label: 'FECH ENV', sortable: true },
          { key: 'recibidor', label: 'QUIEN RECIBE',
          sortable: true,
            sortByFormatted: true,
            filterByFormatted: true },
            {key:'CANT_ACEPTADA',label:'CANT ACEPTADA'},
            { key: 'actions', label: 'COMENTARIO' },
            { key: 'actions2', label: 'Mas informacion' }
            
            
            
        ],
        totalRows:1,
        currentPage: 1,
        perPage: 5,
        pageOptions: [5, 10, 15],
        sortBy: '',
        sortdesc: false,
        sortdirection: 'asc',
        filter: null,
        filterOn: [],
        selectMode: 'single',
        infoModal: {
          id: 'info-modal',
          title: '',
          content: ''
        }
        }),
  computed:{
    
  transaccionesEnCursoOtrosMostrar:function(){
    let aux = this.transaccionesEnCurso.filter(function(transaccion){
      return transaccion.recibidor==Firebase.auth().currentUser.email
    })
    
    /*aux[0]['aceptar']="Aceptar"
    aux[0]['rechazar']="Rechazar"
    aux[0]['cantidad']=60

     aux[1]['aceptar']="Aceptar"
    aux[1]['rechazar']="Rechazar"
    aux[1]['cantidad']=50*/
    
    return aux
  },
  sortOptions() {
        // Create an options list from our fields
        return this.fields
          .filter(f => f.sortable)
          .map(f => {
            return { text: f.label, value: f.key }
          })
      }
  },
  
  methods:{
      declararRechazo(){
          
      },
      proc(hola){
        console.log(hola)
      },
      onRowSelected(items) {
        clearSelected();
        this.selected = items
        console.log('0')
      },
      hola(cantAceptadas,item,comment){
        console.log(item[".key"])
        console.log(cantAceptadas)
        console.log(item.cantidadEnviada)
        if(this.comentario[item[".key"]]===undefined)
        {
         this.comentario[item[".key"]]='';
        }
        if((isNaN(parseInt(cantAceptadas)))||parseInt(cantAceptadas)<0){
   this.$swal({type: 'error',
  title: 'Oops...',
  text: 'Por favor introducir un numero entero positivo',
  });

          return;
        }
        console.log(parseInt(item.cantidadEnviada));
          console.log(parseInt(cantAceptadas));
        if(parseInt(item.cantidadEnviada)<parseInt(cantAceptadas)){

          this.$swal({type: 'error',
  title: 'Oops...',
  text: 'El numero introducido no puede ser mayor a la cantidad enviada',
  });

          console.log(parseInt(item.cantidadEnviada));
          console.log(parseInt(cantAceptadas));
          return;
        }
        this.$swal({
  title: '¿Estas seguro de aceptar?',
  text: `Estas aceptando ${parseInt(cantAceptadas)} del total de ${item.cantidadEnviada} de ${item.enviador}`,
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Si, aceptar'
}).then((result) => {
  if (result.value) {
    this.$swal(
      'Enviado',
      `Aceptaste la cantidad de ${parseInt(cantAceptadas)} del total de ${item.cantidadEnviada} de ${item.enviador}`,
      'Exito'
    )
    //variable que se va a pushear a Home
        this.enviarAHome.cantidadEnviada=item.cantidadEnviada
        this.enviarAHome.cantidadRecibida=parseInt(cantAceptadas)
        this.enviarAHome.enviador=item.enviador
        this.enviarAHome.recibidor=item.recibidor
        this.enviarAHome.fechaEnviada=item.fechaEnviada
        this.enviarAHome.fechaRecibida=new Date();
        this.enviarAHome.fechaRecibida=this.enviarAHome.fechaRecibida.toUTCString();
        if(comment!==undefined)
        this.enviarAHome.comentario=comment
        else
        this.enviarAHome.comentario='--nada--'
        this.enviarAHome.remito=item.remito
        this.enviarAHome.ordenCompra=item.ordenCompra
        this.enviarAHome.nombreChofer=item.nombreChofer
        this.enviarAHome.dniChofer=item.dniChofer
        this.enviarAHome.patenteChofer=item.patenteChofer
        transaccionesHechasRef.push(this.enviarAHome)
        //variable que se va a pushear a eliminadas
        this.enviarARechazadas.cantidadEnviada=item.cantidadEnviada
        this.enviarARechazadas.cantidadRechazada=parseInt(item.cantidadEnviada)-parseInt(cantAceptadas)
        this.enviarARechazadas.enviador=item.enviador
        this.enviarARechazadas.recibidor=item.recibidor
        this.enviarARechazadas.fechaEnviada=item.fechaEnviada
        this.enviarARechazadas.fechaRecibida=new Date();
        this.enviarARechazadas.fechaRecibida=this.enviarARechazadas.fechaRecibida.toUTCString();
        if(comment!==undefined)
        this.enviarARechazadas.comentario=comment
        else
        this.enviarARechazadas.comentario='--nada--'
        this.enviarARechazadas.remito=item.remito
        this.enviarARechazadas.ordenCompra=item.ordenCompra
        this.enviarARechazadas.nombreChofer=item.nombreChofer
        this.enviarARechazadas.dniChofer=item.dniChofer
        this.enviarARechazadas.patenteChofer=item.patenteChofer
        transaccionesRechazadasRef.push(this.enviarARechazadas)
        //eliminar de en curso
        transaccionesEnCursoRef.child(item[".key"]).remove()
  }
})
        
      },
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },

      chau(key){
        console.log(`the key is : ${key}`)
        if(this.comentario[key]===undefined)
        this.comentario[key]='';
        
        this.$swal({
          inputValue:this.comentario[key],
          title:'Ingresar comentario de rechazos',
           input: 'textarea',
  inputPlaceholder: 'Escribir aqui...',
  inputAttributes: {
    'aria-label': 'Type your message here'
  },
  showCancelButton: true
        }).then((result)=>{this.comentario[key]=result.value})

      },
      info(item, index, button) {
        this.infoModal.title = `Fila: ${index}`
        this.infoModal.content = `
        Remito: ${item.remito}
        Cantidad enviada: ${item.cantidadEnviada}
        Recibidor: ${item.recibidor}
        Enviador: ${item.enviador}
        Fecha enviada: ${item.fechaEnviada}
        DNI chofer: ${item.dniChofer}
        Patente chofer: ${item.patenteChofer}
        Nombre del chofer: ${item.nombreChofer}
        Orden de compra: ${item.ordenCompra}`
        this.$root.$emit('bv::show::modal', this.infoModal.id, button)
      },
      resetInfoModal() {
        this.infoModal.title = ''
        this.infoModal.content = ''
      }
      
  },
  mounted(){
        this.totalRows = this.transaccionesEnCursoOtrosMostrar.length
      },
  
  firebase:{
    transaccionesEnCurso:transaccionesEnCursoRef
    
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
.custom-file-input:lang(en) ~ .custom-file-label::after {
  content: 'Browse';
}
</style>
