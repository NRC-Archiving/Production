<template>
    <div class="dashboard-main">
        <div class="dashboard-header">
            <div class="dashboard-info">
                <div class="box-text">
                    <span class="text">{{ verifiedDocs }}</span>
                    <span class="text">Dokumen sudah diverifikasi</span>
                </div>
                <span class="material-icons">assignment_turned_in</span>
            </div>
            <div class="dashboard-info">
                <div class="box-text">
                    <span class="text">{{ unverifiedDocs }}</span>
                    <span class="text">Dokumen belum diverifikasi</span>
                </div>
                <span class="material-icons">assignment_late</span>
            </div>
            <div class="dashboard-info">
                <div class="box-text">
                    <span class="text">{{ archivedDocs }}</span>
                    <span class="text">Dokumen terarsipkan</span>
                </div>
                <span class="material-icons">archive</span>
            </div>
        </div>
        <div class="dashboard-menu">
            <div class="box-clickable" @click.prevent="toListDocument('')">
                <span class="material-icons">folder</span>
                <span class="text">Semua Dokumen</span>
            </div>
            <div class="box-clickable" @click.prevent="toListDocument('A01')">
                <span class="material-icons">folder</span>
                <span class="text">Legalitas</span>
            </div>
            <div class="box-clickable" @click.prevent="toListDocument('A02')">
                <span class="material-icons">folder</span>
                <span class="text">Kontrak</span>
            </div>
            <div class="box-clickable" @click.prevent="toListDocument('A03')">
                <span class="material-icons">folder</span>
                <span class="text">Tenaga Ahli</span>
            </div>
            <div class="box-clickable" @click.prevent="toListDocument('A04')">
                <span class="material-icons">folder</span>
                <span class="text">CV</span>
            </div>
            <div class="box-clickable" @click.prevent="toListDocument('A05')">
                <span class="material-icons">folder</span>
                <span class="text">Keuangan</span>
            </div>
            <div class="box-clickable" @click.prevent="toListDocument('A06')">
                <span class="material-icons">folder</span>
                <span class="text">Proyek</span>
            </div>
            <div class="box-clickable" @click.prevent="toListDocument('A07')">
                <span class="material-icons">folder</span>
                <span class="text">Pengurus</span>
            </div>
            <div class="box-clickable" @click.prevent="toListDocument('A08')">
                <span class="material-icons">folder</span>
                <span class="text">Pemegang Saham</span>
            </div>
            <div class="box-clickable" @click.prevent="toListDocument('A09')">
                <span class="material-icons">folder</span>
                <span class="text">Peralatan</span>
            </div>
            <div class="box-clickable" @click.prevent="toListDocument('A10')">
                <span class="material-icons">folder</span>
                <span class="text">Lain-lain</span>
            </div>
            <div class="box-clickable" @click.prevent="toListDocument('B01')">
                <span class="material-icons">folder</span>
                <span class="text">Surat Masuk</span>
            </div>
            <div class="box-clickable" @click.prevent="toListDocument('B02')">
                <span class="material-icons">folder</span>
                <span class="text">Surat Keluar</span>
            </div>
            <div class="box-clickable" @click.prevent="toListDocument('C01')">
                <span class="material-icons">folder</span>
                <span class="text">Sertifikat</span>
            </div>
            <div class="box-clickable" @click.prevent="toListDocument('C02')">
                <span class="material-icons">folder</span>
                <span class="text">SPJB</span>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/api/document.api';
import { mapWritableState } from 'pinia';
import { useDocumentsListStore } from '@/store/documentsStore';
export default {
    data() {
        return {
            verifiedDocs: 0,
            unverifiedDocs: 0,
            archivedDocs: 0,
            showAll: false,
            countDocs: {}
        }
    },
    beforeRouteLeave(to,from) {
        this.currentPage = 1;
    },
    created() {
        this.getVerified();
        this.getUnverified();
        this.getArchived();
    },
    computed: {
        ...mapWritableState(useDocumentsListStore, {
            currentPage: 'currentPage',
            docFilter: 'docFilter'
        }),
    },
    methods: {
        async getVerified() {
            this.axios(api.getListOfDocuments(null, null, null, 'verified', null))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    this.verifiedDocs = body.totalDocuments;
                }
            })
            .catch(err => {
                console.log(err);
            })
        },
        async getUnverified() {
            this.axios(api.getListOfDocuments(null, null, null, 'unverified', null))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    this.unverifiedDocs = body.totalDocuments;
                }
            })
            .catch(err => {
                console.log(err);
            })
        },
        async getArchived() {
            this.axios(api.getListOfDocuments(null, null, null, null))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    this.archivedDocs = body.totalDocuments;
                }
            })
            .catch(err => {
                console.log(err);
            })
        },
        toListDocument(docType) {
            this.docFilter = {
                docType: docType,
                docStatus: '',
                startDate: '',
                endDate: '',
                keyword: ''
            }
            this.$router.push({ path: '/list' });
        }
    }
}
</script>
<style lang="scss" scoped>
.dashboard-main {

    .dashboard-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        min-width: 600px;

        .dashboard-info {
            width: 32.5%;
            display: flex;
            padding: 1rem 2rem;
            background-color: #fff;
            border: 1px solid #ccc;
            justify-content: space-between;

            .box-text {
                display: flex;
                flex-direction: column;
                align-items: start;
            }

            .material-icons {
                font-size: xxx-large;
                color: var(--dark-alt);
            }

            .text {
                font-size: large;
            }
        }

        .dashboard-menu {
            margin-top: 0;
            margin-left: auto;
        }
    }

    .dashboard-menu {
        margin: 1rem 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1rem 2rem;

        .box-clickable {
            width: 240px;
            height: 90px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: var(--primary-alt-3);
            border: 1px solid var(--primary-alt-3);
            padding: 1rem;

            &:hover {
                background-image: linear-gradient(to left, var(--primary-alt-6), var(--primary-alt-3));
                border-bottom: 1px solid var(--dark);
                border-radius: 6px;
                cursor: pointer;

                .material-icons, .text {
                    color: var(--light);
                }
            }

            .material-icons {
                font-size: xxx-large;
            }

            .text {
                margin-left: auto;
                text-align: end;
            }
        }
    }
}
</style>