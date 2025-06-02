<template>
    <div class="container h-100">
        <div class="h-100 d-flex align-items-center justify-content-center">
            <form @submit.prevent="resetPassword">
                <h3 class="text-center">NRC-Archiving</h3>
                <p class="text-center">Password Change Request</p>
                <div class="mb-3">
                    <label for="" class="form-label">Kode OTP:</label>
                    <input type="text" class="form-control border border-grey border-2" v-model="otp" required><br>
                </div>
        
                <div class="mb-3">
                    <label for="" class="form-label">Password:</label>
                    <input type="password" class="form-control border border-grey border-2" v-model="password" required><br>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Confirmation Password:</label>
                    <input type="password" class="form-control border border-grey border-2" v-model="password2" required><br>
                </div>
        
                <div class="mb-3">
                    <button type="submit" :disabled="!isPasswordsEquals" class="btn btn-primary w-100">Lupa Kata Sandi</button>
                </div>
            </form><br>
        </div>
    </div>
</template>

<script>
import api from '@/api/account.api';
export default {
    props: {
        token: {
            type: String,
            required: true
        }
    },
    inject: ['$auth'],
    computed: {
        formValid() {
            return this.otp && this.password && this.password2 && this.isPasswordsEquals();
        }
    },
    data() {
        return {
            otp: '',
            password: '',
            password2: '' 
        }
    },
    methods: {
        isPasswordsEquals() {
            return this.password === this.password2;
        },
        async resetPassword() {
            const userData = {
                otp: this.otp,
                newPassword: this.password
            }
            this.axios(api.resetPassword(userData, this.token))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    alert(body.message);
                } else {
                    const body = response.data;
                    alert('Permintaan gagal diproses. Cek kembali OTP anda!');
                }
            })
            .catch(err => {
                alert('Ada kesalahan. Silahkan coba lagi nanti.');
            });
        }
    }
}
</script>

<style scoped>
form {
    max-width: calc(768px + 15rem);
    padding: 3rem 4rem;
    background-color: rgba(249, 249, 249, 0.3);
    border-radius: 1rem;
    border: 1px solid #ccc;

    @media (min-width: 768px) {
        min-width: calc(768px + 4rem);
    }
}

a, a:hover {
    color: #222;
}
</style>