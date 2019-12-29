<template>
  <div class="home">
    
    <b-container>
    <h3>Envios pendientes</h3>

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
      :items="transaccionesEnCursoMiasMostrar"
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
     <template v-slot:cell(actions3)="rawz">
        <b-button size="sm" @click="info(rawz.item, rawz.index, $event.target)" class="mr-1">
          Mostrar
        </b-button>
        
      </template>
    </b-table>
<b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <pre>{{ infoModal.content }}</pre>
    </b-modal>






    
    </b-container>
    
  </div>
</template>

<script>
import Firebase from 'firebase'
import config from '../config'
import {app} from '../App'
import {db} from '../App'
import {EventBus} from '../main'
let transaccionesEnCursoRef = db.ref('transaccionesEnCurso')
export default {
  name: 'Home',
  data:()=>({transaccionesEnCurso:[],usuario:'',
  fields: [
          { key: 'cantidadEnviada', label: 'CANTIDAD ENV', sortable: true, sortDirection: 'desc' },
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
            { key: 'actions3', label: 'Mas informacion' }
        ],
        totalRows:1,
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
        }

        }),
  computed:{
    transaccionesEnCursoMiasMostrar:function(){
    return this.transaccionesEnCurso.filter(function(transaccion){
      return transaccion.enviador==Firebase.auth().currentUser.email 
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
        this.totalRows = this.transaccionesEnCursoMiasMostrar.length
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
</style>
