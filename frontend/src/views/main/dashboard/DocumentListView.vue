<template>
    <div>
        <div class="modal fade" id="modalPreview" tabindex="-1" aria-labelledby="modalPreviewLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalPreviewLabel">Pratinjau PDF</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <img :src="modalPreview" width="400px"/>
                    </div>
                    <div class="modal-footer">
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="d-flex flex-column" id="list-container">
        <div class="d-flex justify-content-between" style="min-width: 830px;">
            <div>
                <h4>Dokumen Terbaru</h4>
                <p>Daftar dokumen yang masuk sistem</p>
            </div>
            <div>
                <div class="dropdown" v-if="allDocs">
                    <button class="btn btn-secondary" type="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false" style="display: flex; align-items: center; justify-content: center;">
                        <span class="text">Tambah Dokumen</span>
                        <span class="material-icons">add</span>
                    </button>

                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <li><router-link class="dropdown-item" to="/category/1/A01">Legalitas</router-link></li>
                        <li><router-link class="dropdown-item" to="/category/1/A02">Kontrak</router-link></li>
                        <li><router-link class="dropdown-item" to="/category/1/A03">Tenaga Ahli</router-link></li>
                        <li><router-link class="dropdown-item" to="/category/1/A04">CV</router-link></li>
                        <li><router-link class="dropdown-item" to="/category/1/A05">Keuangan</router-link></li>
                        <li><router-link class="dropdown-item" to="/category/1/A06">Proyek</router-link></li>
                        <li><router-link class="dropdown-item" to="/category/1/A07">Pengurus</router-link></li>
                        <li><router-link class="dropdown-item" to="/category/1/A08">Pemegang Saham</router-link></li>
                        <li><router-link class="dropdown-item" to="/category/1/A09">Peralatan</router-link></li>
                        <li><router-link class="dropdown-item" to="/category/1/A10">Lain-lain</router-link></li>
                        <li><router-link class="dropdown-item" to="/category/2/B01">Surat Masuk</router-link></li>
                        <li><router-link class="dropdown-item" to="/category/2/B02">Surat Keluar</router-link></li>
                        <li><router-link class="dropdown-item" to="/category/3/C01">Sertifikat</router-link></li>
                        <li><router-link class="dropdown-item" to="/category/3/C02">SPJB</router-link></li>
                    </ul>
                </div>
                <div v-else>
                    <router-link class="btn btn-secondary d-flex flex-row" :to="`/category/${docCategory}/${docFilter.docType}`">
                        <span class="text">Tambah Dokumen</span>
                        <span class="material-icons">add</span>
                    </router-link>
                </div>
            </div>
        </div>
        <form class="d-flex flex-row align-items-center justify-content-start" id="filter-section" @submit.prevent="queryingDocs">
            <div id="doctype-filter" class="filter-selection">
                <label for="document-type-select"><span class="text">Jenis Dokumen</span></label>
                <!-- <select v-model="docFilter.docType" class="form-select form-select-sm" id="document-type-select" :disabled="!allDocs"> -->
                <select v-model="docFilter.docType" class="form-select form-select-sm" id="document-type-select">
                    <option value="" selected>Semuanya</option>
                    <option value="A01">Legalitas</option>
                    <option value="A02">Kontrak</option>
                    <option value="A03">Tenaga Ahli</option>
                    <option value="A04">CV</option>
                    <option value="A05">Keuangan</option>
                    <option value="A06">Proyek</option>
                    <option value="A07">Pengurus</option>
                    <option value="A08">Pemegang Saham</option>
                    <option value="A09">Peralatan</option>
                    <option value="A10">Lain-lain</option>
                    <option value="B01">Surat Masuk</option>
                    <option value="B02">Surat Keluar</option>
                    <option value="C01">Sertifikat</option>
                    <option value="C02">SPJB</option>
                </select>
            </div>
            <div id="status-filter" class="filter-selection">
                <label for="document-status-select"><span class="text">Status verifikasi</span></label>
                <select v-model="docFilter.docStatus" class="form-select form-select-sm" id="document-status-select">
                    <option value="" selected>Semuanya</option>
                    <option value="verified">Sudah diverifikasi</option>
                    <option value="unverified">Belum diverifikasi</option>
                </select>
            </div>
            <div id="date-filter" class="filter-date">
                <label for="document-date-filter"><span class="text">Tanggal dokumen ditambahkan</span></label>
                <div class="input-group" id="document-date-filter">
                    <input type="date" class="form-control form-control-sm" id="document-start-date-filter" v-model="docFilter.startDate" />
                    <input type="date" class="form-control form-control-sm" id="document-end-date-filter" v-model="docFilter.endDate" />
                </div>
            </div>
            <div id="name-filter" class="filter-search">
                <label for="document-name-search"><span class="text">Cari berdasar nama</span></label>
                <input v-model="docFilter.keyword" type="text" class="form-control form-control-sm" id="document-name-search" :placeholder="this.docFilter.docType ? 'kata kunci' : this.docFilter.keyword" :disabled="!isDocTypeSet"/>
            </div>
            <button class="btn btn-primary btn-sm" type="submit" style="margin-top: auto;">Terapkan</button>
        </form>
        <div class="list-documents" style="min-height: 160px;">
            <div class="d-flex align-items-center justify-content-center" v-if="loading">
                <span class="spinner-border"></span>
            </div>
            <div class="d-flex flex-column align-items-center justify-content-center" v-else-if="!loading && error">
                <p>Data gagal diambil</p>
                <button class="btn btn-outline-secondary" @click.prevent="fetchDocs">Reload</button>
            </div>
            <div class="table-container" v-else-if="!loading && !error">
                <span class="text">Mendapatkan {{ totalDocuments }} dokumen</span>
                <table class="table table-hover">
                    <thead style="position: sticky; top: 0; z-index: 1;">
                        <tr>
                            <th scope="col">No.</th>
                            <th scope="col">Pratinjau</th>
                            <th scope="col" v-if="allDocs">Jenis Dokumen</th>
                            <th scope="col" v-if="allDocs">Nama Dokumen/File</th>
                            <th scope="col" v-if="!allDocs" 
                            v-for="(attribute, index) in docSchema" 
                            :key="index">{{ attribute?.label }}</th>
                            <th scope="col">Waktu Unggah</th>
                            <th scope="col">Status</th>
                            <th scope="col" colspan="3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(doc, index) in docs" :key="index">
                            <td>{{ limit * (currentPage-1) + index + 1 }}</td>
                            <td @click.prevent="modalPreview = `/api/v1/document/pdf/${docs[index].docName}`"
                            data-bs-toggle="modal" 
                            data-bs-target="#modalPreview">
                            <img :src="`/api/v1/document/pdf/${doc.docName}`" alt="Preview Document" width="100" height="100" style="border:1px solid #ddd;">
                            </td>
                            <td v-if="allDocs">{{ documentType(doc.docType) }}</td>
                            <td v-if="allDocs">{{ doc.docName }}</td>
                            <td v-if="!allDocs" v-for="(attribute, index) in docSchema" :key="index">{{ doc[attribute?.name]}}</td>
                            <td>{{ parseToLocalTime(doc.createdDate) }}</td>
                            <td>
                                <span class="badge" :class="`bg-${verifyStatus(doc.verificationStatus, ['primary','secondary'])}`">{{ verifyStatus(doc.verificationStatus, ['Sudah', 'Belum']) }} diverifikasi</span>
                                <span class="badge bg-danger" v-if="doc?.fileRef[0]?.deleted">Ditandai</span>
                            </td>
                            <td>
                                <div class="action-button">
                                    <button title="unduh" @click.prevent="downloadDoc(doc.docName)" style="color: slategray;"><span class="material-icons">file_download</span></button>
                                </div>
                            </td>
                            <td>
                                <div class="action-button">
                                    <router-link :to="`/edit/${doc.docType}/${doc._id}`"><span class="material-icons">open_in_new_down</span></router-link>
                                </div>
                            </td>
                            <td>
                                <div class="action-button" v-if="role == 'superadmin'">
                                    <router-link :to="`/review/${doc.docType}/${doc._id}`"><span class="material-icons">task_alt</span></router-link>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="footer-container" style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
                    <span class="text">Menampilkan {{ currentPage }} dari {{ totalPages }} halaman</span>
                    <div class="btn-toolbar" role="toolbar">
                        <div class="btn-group me-2" role="group">
                            <input v-for="n in totalPages" type="radio" class="btn-check" name="page" :id="`btnradio-page-${n}`" autocomplete="off" :checked="currentPage === n" @change="switchPage(n)">
                            <label v-for="n in totalPages" :class="['btn btn-sm', currentPage === n ? 'btn-primary' : 'btn-secondary']" :for="`btnradio-page-${n}`">{{ n }}</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/api/document.api';
import { mapState, mapWritableState, mapActions } from 'pinia';
import { usePageStore, useDocumentsTypeStore } from '@/store';
import { useToastStore } from '@/store/toastStore';
import { useDocumentsListStore, useDocumentListSchemaStore } from '@/store/documentsStore';
export default {
    inject: ['$auth'],
    created() {
        this.role = this.$auth.getRole();

        this.getDocumentsSchema();
        // get schema for a certain docType
        this.queryingDocs();

        // this.setPageTitle('Dashboard Utama');
        this.$watch(() => this.load, this.fetchDocs, { immediate: true});
        /*
        this.$watch('docFilter.docType', (newDocType, oldDocType) => {
            if (newDocType === "") {
                this.allDocs = true;
            } else {
                this.allDocs = false;
                this.setTableHeaderAttribute(this.docFilter.docType);
            }
            this.fetchDocs();
        });
        */
    },
    computed: {
        ...mapWritableState(useDocumentsListStore, {
            allDocs: 'allDocs',
            docCategory: 'docCategory',
            docFilter: 'docFilter',
            currentPage: 'currentPage',
            limit: 'limit',
            totalPages: 'totalPages',
            totalDocuments: 'totalDocuments',
            docs: 'docs'
        }),
        ...mapWritableState(useDocumentListSchemaStore, {
            schema: 'schema'
        }),
        ...mapState(useDocumentsTypeStore, {
            documentType: 'documentTypeName'
        }),
        isDocTypeSet() {
            if (this.docFilter.docType) {
                return true;
            } else {
                this.docFilter.keyword = '';
                return false;
            }
        },
        hasAnyData() {
            return this.docs.length >= 1;
        }
    },
    data() {
        return {
            loading: false,
            error: false,
            role: 'admin',
            api: api.ApiHost,
            modalPreview: '',
            deleting: false,
            docSchema: []
        };
    },
    methods: {
        getDocumentsSchema() {
            var documentsSchema = JSON.parse(localStorage.getItem('documents-schema'));
            this.schema = documentsSchema;
        },
        setTableHeaderAttribute() {
            var schema = this.schema.find(doc => doc.formId == this.docFilter.docType)?.formSchema;
            if (this.docFilter.docType == 'A04') {
                const hiddenFields = ["ttl", "pendidikanTerakhir", "instansiPendidikan", "tahunLulus", "alamatKtp"];
                this.docSchema = schema.filter(attribute => !hiddenFields.includes(attribute.name));
            } else {
                this.docSchema = schema
            }
        },
        async fetchDocs() {
            this.loading = true;
            this.error = false;
            
            const role = this.$auth.getRole();
            const withFileDetail = true;
            if (this.docFilter.docType) {
                this.currentPage = 1;
            }

            this.axios(api.getListOfDocuments(
                this.currentPage,
                this.limit,
                this.docFilter.docType,
                this.docFilter.docStatus,
                this.docFilter.startDate,
                this.docFilter.endDate,
                this.docFilter.keyword,
                withFileDetail)
            )
            .then((response) => {
                if (response.status == 200) {
                    const body = response.data;
                    this.totalPages = body.totalPages;
                    this.totalDocuments = body.totalDocuments;
                    this.currentPage = body.currentPage;
                    this.docs = body.documents;
                    console.log('Dokumen berhasil didapatkan.');
                } else {
                    this.error = true;
                    console.log('Gagal melakukan permintaan.');
                }
            })
            .catch((err) => {
                console.log(err);
                this.error = true;
            })
            .finally(() => {
                this.loading = false;
            })
        },
        async downloadDoc(filename) {
            this.axios(api.getPdf(filename))
            .then(response => {
                if (response.status == 200) {
                    const blob = response.data;
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();

                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                } else {
                    console.log('Gagal mengunduh dokumen. Status: ', response.status);
                }
            })
            .catch(err => {
                console.log('Terjadi kesalahan saat mengunduh dokumen. Error: ', err);
            });
        },
        parseToLocalTime(strDate) {
            const date = new Date(strDate);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");

            return `${year}-${month}-${day} ${hours}:${minutes}`;
        },
        verifyStatus(verified, results) {
            if (verified == 'verified') {
                return results[0];
            } else {
                return results[1];
            }
        },
        docTypeValidity(stringObj) {
            const obj = JSON.parse(stringObj);
            return obj.docTypeValidity;
        },
        switchPage(page) {
            this.currentPage = page;
            this.fetchDocs();
        },
        queryingDocs() {
            const docType = this.docFilter.docType;
            if (docType == 'A01' ||
                docType == 'A02' ||
                docType == 'A03' ||
                docType == 'A04' ||
                docType == 'A05' ||
                docType == 'A06' ||
                docType == 'A07' ||
                docType == 'A08' ||
                docType == 'A09' ||
                docType == 'A10') {
                this.docCategory = 1;
            } else if (docType == 'B01' || docType == 'B02') {
                this.docCategory = 2;
            } else if (docType == 'C01' || docType == 'C02') {
                this.docCategory = 3;
            }

            this.allDocs = (docType) ? false : true;

            this.fetchDocs();
            this.setTableHeaderAttribute(docType);
        },
        ...mapActions(usePageStore, {
            setPageTitle: 'setPageTitle'
        }),
        ...mapActions(useToastStore, {
            setToast: 'setToast'
        }),
    }
}
</script>
<style lang="scss" scoped>
#list-container {
    .text {
        margin-left: 2px;
    }

    #filter-section {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: start;
        min-width: 830px;
        gap: 6px;
        
        .text {
            margin: 0 0 0 4px;
            font-size: small;
        }

        .filter-selection {
            display: flex;
            flex-direction: column;
        }
    }

    .list-documents {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-top: 1rem;

        .loading-overlay {
            position: absolute;
            width: 100%;
            height: 30vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 8px;
            z-index: 997;
        }

        .error-container {
            position: absolute;
            width: 100%;
            height: 30vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 1px solid #ccc;
            border-radius: 8px;
            background-color: #fff;
        }

        .table-container {
            display: flex;
            flex-direction: column;
            width: 100%;
            min-height: 30vh;

            th {
                background-color: var(--dark);
                color: var(--light);
            }
        }
    }
}

.toast-container {
    bottom: 0;
    right: 0;
    margin-bottom: 1rem;
    margin-right: 1rem;
    position: fixed;
    z-index: 999;
}

.action-button {
    display: flex;
    justify-content: start;
    align-items: center;

    button {
        border:none;
        background: none;

        .icon-verified {
            background-color: var(--green);
        }

        .icon-unverified {
            background-color: var(--grey);
        }
    }
}
</style>