<template>
    <div class="container">
        <Spinner v-show="!load"/>

        <div class="HeaderDown" v-show="load">
            <div class="AndroidDownload" v-show="load"><a href="https://play.google.com/store/apps/details?id=com.chessrecipestournaments&rdid=com.chessrecipestournaments&pli=1" target="_blank"><img class="Logo" src="../assets/download_on_google_play.png"></a></div>

            <div class="LogoCenter">
                <a href="https://www.albertochueca.com" target="_blank" v-show="load"><img class="Logo" src="../assets/logo.png"></a>
            </div>
        </div>

        <div class="SelectContainer" v-show="load">
            <div class="SelectedDate">
                <cool-select class="CoolSelect" v-model="selectDate" :items="dateForFilter" placeholder="Select date">
                    <template slot="item" slot-scope="{ item: country }">
                        {{country | formatDate}}
                    </template>

                    <template slot="selection" slot-scope="{ item: country }">
                        {{country | formatDate}}
                    </template>
                </cool-select>
            </div>

            <div class="SelectedCountry" v-show="load">
                <cool-select class="CoolSelect" v-model="selectCountry" :items="countrys" item-value="fed_country_name" item-text="fed_country_name"  placeholder="Select country">
                    <template slot="item" slot-scope="{ item: country }">
                        <div class="Item">
                            <div class="country">
                                <img class="country-flag" :src="getFlagSrc(country.fed_country_name)" width="24" height="24">
                            </div>

                            <div class="description" style="align-self: center;">
                                {{ country.fed_country_name }}
                            </div>
                        </div>
                    </template>

                    <template slot="selection" slot-scope="{ item: country }">
                        <div class="Item">
                            <div class="country">
                                <img class="country-flag" :src="getFlagSrc(country.fed_country_name)" width="24" height="24">
                            </div>

                            <div class="description" style="align-self: center;">
                                {{ country.fed_country_name }}
                            </div>
                        </div>

                    </template>
                </cool-select>
            </div>
        </div>
     
        <table class="table b-table table-striped" v-show="load">
            <tbody>
              <tr v-for="(tournament, index) in paginatedData" :key="index">
                  <template>
                    <td class="Flex-td">
                        <div class="Item" v-if="index != 15">
                            <div class="country">
                                <img :alt="tournament.fed_country_name" :src="getFlagSrc(tournament.fed_country_name)">
                            </div>

                            <div class="description">
                                <div>{{tournament.t_name}}</div>
                                <div class="date"><small><font-awesome-icon icon="clock" /> {{ tournament.t_date_from }}</small></div>
                            </div>
                        </div>

                        <div v-else>
                            <a href="https://www.albertochueca.com"><img class="Imagen" src="../assets/banner.png" target="_blank"></a>
                        </div>

                        <div class="link" v-if="index != 15">
                            <a :href="tournament.t_link" target="_blank"><font-awesome-icon icon="external-link-alt" /></a>
                        </div>
                    </td>
                  </template>
              </tr>
            </tbody>
        </table>

        <div class="Button" v-show="load">
            <button class="btn btn-primary" :disabled="pageNumber === 0" @click="prevPage">
                Previous
            </button>
            <button class="btn btn-primary" :disabled="pageNumber >= pageCount -1" @click="nextPage">
                Next
            </button>
        </div>
    </div>
</template>

<script>
import Spinner from './spinner.vue'
import { getTournament } from '../api'
import { CoolSelect } from 'vue-cool-select'

export default {
    name: "Calendar",
    props: ['countrys'],
    data() {
        return {
          selectCountry: "null",
          selectDate: "null",
          tournaments: [],
          dateForFilter: [],
          load: false,
          pageNumber: 0,
        //   listData: {
        //       type: Array,
        //       required: true
        //   },
          size: 150
        }
    },
    components: {
        Spinner,
        CoolSelect
    },
    methods: {
        nextPage() {
            this.pageNumber++;
        },
        prevPage() {
            this.pageNumber--;
        },
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
            //   let urlImage = require(`../assets/train-chess-1500x563.jpg`)
            //     self.$parent.styles = {
            //         'background-image': `url(${urlImage})`,
            //         'background-repeat': 'no-repeat',
            //         'background-size': 'contain',
            //         'background-position': 'top center'
            //     }
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
        pageCount() {
            let data = this.tournaments
            let countrySelected = this.selectCountry
            let monthSelected = this.selectDate

            if (countrySelected=="null" || countrySelected==null) {
                data = this.tournaments
            } else {
                data = data.filter(tournament => tournament.fed_country_name == countrySelected)
            }

            if (monthSelected=="null" || monthSelected==null) {
                data = data
            } else {
                data = data.filter(tournament => {
                    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    
                    let d1 = tournament.t_date_from.split('-')
                    let n1 = new Date(d1[2], d1[1], '01')

                    let d2 = monthSelected.split('-')
                    let n2 = new Date(d2[1], d2[0], '01')

                    return `${monthNames[n1.getMonth() -1 ]}-${n1.getFullYear()}` == `${monthNames[n2.getMonth()]}-${n2.getFullYear()}`
                })
            }


            let l = data.length,
                s = this.size;
            return Math.floor(l / s);
        },
        paginatedData() {
            let data = this.tournaments
            let countrySelected = this.selectCountry
            let monthSelected = this.selectDate

            if (countrySelected=="null" || countrySelected==null) {
                data = this.tournaments
            } else {
                data = data.filter(tournament => tournament.fed_country_name == countrySelected)
            }

            if (monthSelected=="null" || monthSelected==null) {
                data = data
            } else {
                data = data.filter(tournament => {
                    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    
                    let d1 = tournament.t_date_from.split('-')
                    let n1 = new Date(d1[2], d1[1], '01')

                    let d2 = monthSelected.split('-')
                    let n2 = new Date(d2[1], d2[0], '01')

                    return `${monthNames[n1.getMonth() -1 ]}-${n1.getFullYear()}` == `${monthNames[n2.getMonth()]}-${n2.getFullYear()}`
                })
            }

            const start = this.pageNumber * this.size,
                end = start + this.size;


            let l = data.length,
                s = this.size;

            if (Math.floor(l / s) < this.pageNumber) {
                this.pageNumber = 0
            }

            return data
                .slice(start, end);
        },
       
    },
}

require(`../assets/header-chess-tournaments.jpg`)
</script>

<style>
.Imagen {
    width: 100%;
    height: 100%;
}
.Button {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
}
.Header {
    width: 100%;
    margin: auto;
    height: 240px;
    
}
.HeaderDown {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 75px;
    padding: 70px 0;
    margin-bottom: 8px;

    overflow: hidden;
    background-image: url(/img/header-chess-tournaments.jpg);
    background-repeat: no-repeat;
    background-position: top left;
    background-size: inherit;
}
.AndroidDownload {
    width: 200px;
    height: 60px;
    margin-right: 10px;
}
.AndroidDownload img {
    width: 100%;
    height: 100%;
}
.LogoCenter {
    height: 100px;
}

.table{
    background-color: #ffffff9e
}

.SelectContainer {
    display: flex;
}
@media screen and (max-width: 760px) {
    .SelectContainer {
        flex-direction: column;
    }
    .Logo {
        width: 100%;
    }
}
@media screen and (max-width: 560px) {
    .Logo {
        width: 100%;
    }
    .HeaderDown {
        flex-direction: column;
    }
}

.CoolSelect {
    margin-bottom: 10px;
}
.Flex-td {
    display: flex;
    justify-content: space-between;
}
.Flex-td .link {
    width: 40px;
    flex-shrink: 0;
}
.Flex-td .link a {
    width: 100%;
    height: 100%;
}

.Item {
    display: flex
}
.Item .description {
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-left: 10px;
}
.Item .description .date {
    line-height: 10px;
}

.Item img {
    width: 32px;
    height: 32px;
}

</style>
