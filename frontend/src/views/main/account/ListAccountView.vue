<template>
    <div class="modal fade" id="modalDelete" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalDeleteLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalDeleteLabel">Penghapusan Akun</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Anda yakin akan menghapus akun <b class="target-username">username</b> secara permanen?</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline-danger" id="btn-yes-delete" data-bs-dismiss="modal" @click.prevent="deleteAccount">Lanjutkan</button>
                    <button class="btn btn-primary" id="btn-no-delete" data-bs-dismiss="modal">Batalkan</button>
                </div>
            </div>
        </div>
    </div>
    <div class="list-account-view">
        <div class="header">
            <h4>Daftar Akun</h4>
            <div>
                <router-link to="/accounts/create" class="btn btn-primary btn-sm" id="btn-to-create-account" >
                    <span class="text">Tambah Akun</span>
                    <span class="material-icons">add</span>
                </router-link>
            </div>
        </div>
        <div class="content" style="min-height: 160px;">
            <div class="d-flex align-items-center justify-content-center" v-if="loading">
                <span class="spinner-border"></span>
            </div>
            <div class="d-flex flex-column align-items-center justify-content-center" v-else-if="!loading && !hasAnyData">
                <p>Data gagal diambil</p>
                <button class="btn btn-outline-secondary" @click.prevent="getAllAccounts">Reload</button>
            </div>
            <table class="table table-hover" v-else-if="!loading && hasAnyData">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Reset Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, _id) in accounts" :key="_id">
                        <td>{{ user.username }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.role }}</td>
                        <td>{{ user.resetStatus }}</td>
                        <td class="d-flex flex-row align-items-center justify-content-between">
                            <div id="actions-col-1" v-if="user.role != 'superadmin'" class="d-flex gap-1">
                                <button class="btn btn-success" :disabled="forgotPasswordRequest(user.resetStatus)" @click.prevent="approveResetRequest(user, true)" >Approve</button>
                                <button class="btn btn-danger" :disabled="forgotPasswordRequest(user.resetStatus)" @click.prevent="approveResetRequest(user, false)" >Cancel</button>
                            </div>
                            <div class="invisible" id="actions-col-1" v-else>
                                <button class="btn" :disabled="true">_blank</button>
                                <button class="btn" :disabled="true">_blank</button>
                            </div>
                            <div id="actions-col-2">
                                <div v-if="user.role != 'superadmin'" class="d-flex flex-row gap-1">
                                    <div>
                                        <a class="btn btn-sm btn-outline-danger pt-2" type="button" data-bs-toggle="modal" data-bs-target="#modalDelete" title="Hapus" 
                                        :data-bs-username="user.username"
                                        :data-bs-email="user.email"
                                        :data-bs-role="user.role">
                                            <span class="material-symbols-outlined fs-6">delete</span>
                                        </a>
                                    </div>
                                    <div>
                                        <router-link :to="`/accounts/edit/${user._id}`" title="Ubah" class="btn btn-sm btn-outline-primary pt-2">
                                            <span class="material-symbols-outlined fs-6">edit</span>
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import api from '@/api/account.api';
import { useToastStore } from '@/store/toastStore';
import { useEventListener } from '@vueuse/core';
import { mapActions } from 'pinia';
export default {
    inject: ['$auth'],
    setup() {
        useEventListener(document, 'show.bs.modal', (event) => {
            const button = event.relatedTarget;
            const username = button.getAttribute('data-bs-username');
            const email = button.getAttribute('data-bs-email');
            const role = button.getAttribute('data-bs-role');
            const user = { username, email, role };

            const modalDelete = document.getElementById('modalDelete');
            const modalDeleteUserTarget = modalDelete.querySelector('.target-username');

            modalDeleteUserTarget.textContent = `${username}`;

            const nextBtn = modalDelete.querySelector('.modal-footer #btn-yes-delete');

            nextBtn.setAttribute('data-bs-username', user.username);
            nextBtn.setAttribute('data-bs-email', user.email);
            nextBtn.setAttribute('data-bs-role', user.role);
        })
    },
    created() {
        const role = this.$auth.getRole();
        if (role !== 'superadmin') {
            router.replace({ path: '/' });
        }

        this.$watch(() => this.load, this.getAllAccounts, { immediate: true });
    },
    computed: {
        hasAnyData() {
            return this.accounts.length >= 1;
        }
    },
    data() {
        return {
            response: {
                error: false,
                code: 0,
            },
            loading: false,
            accounts: []
        }
    },
    methods: {
        ...mapActions(useToastStore, {setToast: 'setToast'}),
        async getAllAccounts() {
            this.loading = true;
            this.response.error = false;
            this.response.code = 0;

            this.axios(api.getAllAccounts())
            .then(response => {
                this.response.code = response.status;

                if (response.status == 200) {
                    this.response.error = false;

                    const body = response.data;
                    this.accounts = body.data.accounts;
                } else {
                    this.response.error = true;

                    this.setToast('Ada Kesalahan', 'Kesalahan dalam memuat data', 3000);
                }
            })
            .catch(err => {
                if (err.response) {
                    this.response.code = err.response['status'];
                } else {
                    this.response.code = 500;
                }
                this.response.error = true;
                this.setToast('Ada Kesalahan', 'Kesalahan dalam memuat data', 3000);
                console.log(err);
            })
            .finally(() => {
                this.loading = false;
            })
        },
        approveResetRequest(userdata, isApproved) {
            this.loading = true;
            this.response.error = false;
            this.response.code = 0;

            this.axios(api.approveRequest(userdata, isApproved))
            .then(response => {
                this.response.code = response.status;

                if (response.status = 200) {
                    this.response.error = false;
                } else {
                    this.response.error = true;
                }
            })
            .catch(err => {
                if (err.response) {
                    this.response.code = err.response['status'];
                } else {
                    this.response.code = 500;
                }
                this.response.error = true;
                this.setToast('Ada Kesalahan', 'Permintaan tidak bisa diproses', 3000);
                console.log(err);
            })
            .finally(() => {
                this.loading = false;
            })
        },
        forgotPasswordRequest(resetStatus) {
            return resetStatus !== 'pending';
        },
        deleteAccount(event) {
            const btnElement = event.target;

            const username = btnElement.getAttribute('data-bs-username');
            const email = btnElement.getAttribute('data-bs-email');
            const role = btnElement.getAttribute('data-bs-role');
            
            if (username && email && role) {
                this.loading = true;
                this.response.error = false;
                this.response.code = 0;

                const userdata = {
                    username,
                    email,
                    role
                };
                this.axios(api.deleteAcc(userdata))
                .then(response => {
                    this.response.code = response.status;

                    if (response.status == 200) {
                        this.response.error = false;
                        
                        this.setToast('Hapus akun', 'Akun berhasil dihapus.', 2000);
                    } else {
                        this.response.error = true;

                        this.setToast('Hapus akun', 'Akun gagal dihapus.', 2000);
                    }
                    this.getAllAccounts();
                })
                .catch(err => {
                    if (err.response) {
                        this.response.code = err.response['status'];
                    } else {
                        this.response.code = 500;
                    }
                    this.response.error = true;
                    this.setToast('Hapus akun', 'Kesalahan dalam memproses permintaan', 3000);
                    console.log(err);
                })
                .finally(() => {
                    this.loading = false;
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.list-account-view {
    padding: 1rem 0;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
}

.header {
    display: flex;
    margin: 0 2rem;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 1rem;

    #btn-to-create-account {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
    }
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    th {
        background-color: var(--dark);
        color: var(--light);
    }

    .action-button {
        border-left-width: 0;
        padding: 5px;
        flex-wrap: wrap;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        #actions-col-1 {
            display: flex;
            flex-direction: row;
            gap: 1rem;
        }
    }

    table button {
        padding: 5px 10px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
    }

    button:hover {
        opacity: 0.8;
    }
}
</style>