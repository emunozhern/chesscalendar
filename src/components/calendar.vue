<template>
<div>
    <Spinner v-show="!load"/>

    

    <div class="Button-container" >
        <button class="Button-child" v-for="(item, index) in dateForFilter" :key="index" v-on:click="handleMonth(item)">
            {{item | formatDate}}
        </button>
    </div>

    <table class="table-responsive-full" v-show="load">
        <thead>
          <tr>
            <th>
                <div class="Table-th">

                    <span class="Table-th-child">Chess Tournament Calendar</span>

                    <select v-model="selectCountry" class="select-country Table-th-child" v-show="load">
                        <option :value="null">All options</option>
                        <option v-for="(country, index) in countrys" :key="index" v-bind:value="country.fed_country_name">{{country.fed_country_name}}</option>
                    </select>
                </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tournament, index) in filterTournament" :key="index">
              <template>
                <td>{{ tournament.t_date_from }}  <img width="16" height="16" :alt="tournament.fed_country_name" :src="getFlagSrc(tournament.fed_country_name)"> {{tournament.t_name}}</td>
              </template>
          </tr>
        </tbody>
    </table>
</div>
</template>

<script>
import Spinner from './spinner.vue'
import { getTournament } from '../api'
export default {
    name: "Calendar",
    props: ['countrys'],
    data() {
        return {
          selectCountry: "null",
          selectDate: "null",
          tournaments: [],
          dateForFilter: [],
          load: false
        }
    },
    components: {
        Spinner,
    },
    methods: {
        handleMonth(date) {
            this.selectDate = date
        },
        getMonthForFilter() {
            let currentDate = new Date();

            for (let i = 0; i < 12; i++) {
                
                if (!this.dateForFilter.includes(`${currentDate.getMonth()}-${currentDate.getFullYear()}`)) {
                    this.dateForFilter.push(`${currentDate.getMonth()}-${currentDate.getFullYear()}`)
                }
                
                currentDate.setMonth(currentDate.getMonth() + 1);
            }

            return this.dateForFilter
        },
        getAllTournament() {
            const self = this
            this.load = false
            this.tournaments = []
            this.monthsForFilter = []

            getTournament().then(t => {
              self.tournaments = t
              self.load = true
            })
        },
        getFlagSrc(country) {
            let m;
            try {
                m = require(`../assets/flags/${country.toLowerCase().replace(" ", "-")}.png`);
            } catch (ex) {
                m = `${country.toLowerCase().replace(" ", "-")}.png`
            }
            return m;
        }
    },
    mounted() {
        this.getAllTournament(),
        this.getMonthForFilter()
    },
    filters: {
        formatDate: function (value) {
            let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let d = value.split('-')
            let n = new Date(d[1], d[0], '01')
            return `${monthNames[n.getMonth()]} ${n.getFullYear()}`;
        }
    },
    computed: {
        filterTournament: function () {
            let data = this.tournaments
            let countrySelected = this.selectCountry
            let monthSelected = this.selectDate

            if (countrySelected=="null") {
                //
            } else {
                data = data.filter(tournament => tournament.fed_country_name == countrySelected)
            }

            if (monthSelected=="null") {
                //
            } else {
                data = data.filter(tournament => {
                    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    
                    let d1 = tournament.t_date_from.split('-')
                    let n1 = new Date(d1[2], d1[1], '01')
                    // console.log(`${monthNames[n1.getMonth() -1]}-${n1.getFullYear()}`)

                    let d2 = monthSelected.split('-')
                    let n2 = new Date(d2[1], d2[0], '01')

                    // console.log(`${monthNames[n2.getMonth()]}-${n2.getFullYear()}`)
                    return `${monthNames[n1.getMonth() -1 ]}-${n1.getFullYear()}` == `${monthNames[n2.getMonth()]}-${n2.getFullYear()}`
                })
            }

            return data
        }
    },
}
</script>

<style scoped>
*, *:before, *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
input, select {
    background-color: #fff;
    color: #2c3e50;
    font-size: 1em;
    padding: 10px;
    width: auto;
    border: 2px solid #ff6b02;
    border-radius: 4px;
}
small {color:#808080;}

.Button-container, .Table-th {
    display: flex;
}

.Table-th .Table-th-child {
    justify-content: normal;
    width: 100%;
}

.Button-container {
    margin: auto;
    width: 50%;
    max-width: 100%;
    flex-wrap: wrap;
    justify-content: space-around;
}

.Button-child {
    margin-bottom: 10px;
    height: 40px;
}
button {
    bottom:1px;
    cursor:pointer;
    margin-right:8px;
    padding:4px 11px;
    border:1px solid #0085a6;
    background:none;
    border-radius:3px;
    color:#0085a6;
    font-size:1em;
    transition:all .3s ease-in-out;
}
button:hover {background:#0085a6; color:#fff;}
.select-country {
    /* margin-bottom:40px; */
}
.table-responsive {min-height:.01%;	overflow-x:auto;}
@media screen and (max-width: 801px) {
    .table-responsive {width:100%; overflow-y:hidden; -ms-overflow-style:-ms-autohiding-scrollbar;}
}
table {
    border-collapse:collapse;
    border-spacing:0;
    -webkit-box-shadow:0px 7px 6px -6px rgba(0,0,0,.28);
    -moz-box-shadow:0px 7px 6px -6px rgba(0,0,0,.28);
    box-shadow:0px 7px 6px -6px rgba(0,0,0,.28);
    margin-bottom:40px;
    margin-top:.5em;	
    margin: auto;
    width:50%; 
    max-width:100%;
    
}
table thead tr {border-bottom:3px solid #ff6b02; color:#000;}
table tfoot tr {border-top:3px solid #ff6b02;}
table thead th, table tfoot th {
    background-color:#fff;
    color:#000;
    font-size:.83333em;
    line-height:1.8;
    padding: 15px 14px 13px 14px;
    position:relative;
    text-align:left;
    text-transform:uppercase;	
}
table tbody tr {background-color:#fff;}
table tbody tr:hover {background-color:#eee; color:#000;}
table th, table td {
    border:1px solid #bfbfbf;
    padding:10px 14px;
    position:relative;
    vertical-align:middle;
    text-align: left;
}
table th img, table td img {
    vertical-align: text-bottom;
    margin-left: 10px;
}
caption {font-size:1.111em; font-weight:300; padding:10px 0;}

@media (max-width:1024px) {
    table {font-size: .944444em;}
}
@media (max-width:767px) {
    table {font-size: 1em;}
}

@media (max-width: 767px) {
    .table-responsive-full {box-shadow:none;}
    .table-responsive-full thead tr, 
    .table-responsive-full tfoot tr {display:none;}
    .table-responsive-full tbody tr {
        -webkit-box-shadow:0px 7px 6px -6px rgba(0,0,0,.28);
           -moz-box-shadow:0px 7px 6px -6px rgba(0,0,0,.28);
                    box-shadow:0px 7px 6px -6px rgba(0,0,0,.28);
        margin-bottom:20px;
    }
    .table-responsive-full tbody tr:last-child {margin-bottom:0;}
    .table-responsive-full tr,
    .table-responsive-full td {display:block;}
    .table-responsive-full td {
        background-color:#fff;
        border-top:none;
        position:relative;
        /* padding-left:50%; */
        padding: 5% 20%;
    }
    .table-responsive-full td:hover {background-color:#eee; color:#000;}
    .table-responsive-full td:hover:before {color:hsl(0, 0%, 40%);}
    
    .table-responsive-full td:first-child {
        border-top:1px solid #bfbfbf;
        border-bottom: 3px solid #0085a6;
        border-radius: 4px 4px 0 0;
        color: #000;
        font-size: 1.11111em;
        font-weight: bold;
    }
    .table-responsive-full td:before {
        content: attr(data-label);
        display: inline-block;
        color: hsl(0, 0%, 60%);
        font-size: 14px;
        font-weight: normal;
        margin-left: -100%;
        text-transform: uppercase;
        width: 100%;
        white-space:nowrap;
    }
}
@media (max-width: 360px) {
    .table-responsive-full td {
        padding-left: 14px;
    }

    .table-responsive-full td:before {
        display: block;
        margin-bottom: .5em;
        margin-left: 0;
    }
    }

    .sort-table-arrows {
        float: right;
        transition: .3s ease;
    }

    .sort-table-arrows button {
        margin: 0;
        padding: 4px 8px;
    }

    .sort-table th.title,
    .sort-table th.composer {
        width: 20% !important;
    }

    .sort-table th.lyrics,
    .sort-table th.arranger,
    .sort-table th.set,
    .sort-table th.info {
        width: 15% !important;
    }

    .sort-table .title {
        font-weight: bold;
    }

    .sort-table .title small {
        font-weight: normal;
    }

    @media (max-width:1024px) {

        .sort-table th,
        .sort-table-arrows {
            text-align: left;
        }

        .sort-table-arrows {
            float: none;
            padding: 8px 0 0;
            position: relative;
            right: 0px;
        }

        .sort-table-arrows button {
            bottom: 0;
        }
    }

    @media (max-width:767px) {
        .sort-table thead tr {
            border-bottom: none;
            display: block;
            margin: 10px 0;
            text-align: left;
        }

        .sort-table thead tr th.arranger {
            display: none;
        }

        .sort-table th {
            border-bottom: 1px solid #bfbfbf;
            border-radius: 4px;
            display: inline-block;
            font-size: .75em;
            line-height: 1;
            margin: 3px 0;
            padding: 10px;
        }

        .sort-table th.title,
        .sort-table th.composer,
        .sort-table th.lyrics,
        .sort-table th.set,
        .sort-table th.info {
            width: 100px !important;
        }

        .sort-table td.title:before {
            display: none;
        }

        .sort-table td.title {
            letter-spacing: .03em;
            padding-left: 14px;
        }
    }
</style>
