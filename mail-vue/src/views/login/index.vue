<template>
  <div id="login-box" v-loading="oauthLoading" element-loading-text="登录中...">
    <div v-if="settingStore.settings.background" class="login-custom-background" :style="background" aria-hidden="true"></div>
    <header class="login-brandbar">
      <a class="mail-brand" href="https://g3rry.com/" :aria-label="$t('backToPersonalSite')">
        <span>g3rry<span class="brand-dot" aria-hidden="true">.</span></span><small>Mail</small>
      </a>
      <a class="login-home" href="https://g3rry.com/">g3rry.com <span aria-hidden="true">↗</span></a>
    </header>
    <section class="login-intro" aria-labelledby="mail-welcome-title">
      <p class="login-eyebrow"><span aria-hidden="true"></span>{{ $t('personalMail') }}</p>
      <h1 id="mail-welcome-title">Keeping <br>in touch<span aria-hidden="true">.</span></h1>
      <p class="login-note">{{ $t('mailWelcome') }}</p>
      <div class="correspondence-mark" aria-hidden="true"><span>G.Z.</span><span>01 / Correspondence</span></div>
    </section>
    <div class="form-wrapper">
      <div class="container">
        <p class="form-eyebrow">MAIL / {{ $t('personalMail') }}</p>
        <h2 class="form-title">{{ settingStore.settings.title }}<span aria-hidden="true">.</span></h2>
        <span class="form-desc" v-if="show === 'login'">{{ $t('loginTitle') }}</span>
        <span class="form-desc" v-else>{{ $t('regTitle') }}</span>
        <div v-show="show === 'login'">
          <el-input :class="settingStore.settings.loginDomain === 0 ? 'email-input' : ''" v-model="form.email"
                    type="text" :placeholder="$t('emailAccount')" :aria-label="$t('emailAccount')" autocomplete="off">
            <template #append v-if="settingStore.settings.loginDomain === 0">
              <div @click.stop="openSelect">
                <el-select
                    v-if="show === 'login'"
                    ref="mySelect"
                    v-model="suffix"
                    :placeholder="$t('select')"
                    class="select"
                >
                  <el-option
                      v-for="item in domainList"
                      :key="item"
                      :label="item"
                      :value="item"
                  />
                </el-select>
                <div style="color: var(--el-text-color-primary)">
                  <span>{{ suffix }}</span>
                  <Icon class="setting-icon" icon="mingcute:down-small-fill" width="20" height="20"/>
                </div>
              </div>
            </template>
          </el-input>
          <el-input v-model="form.password" :placeholder="$t('password')" :aria-label="$t('password')" type="password" autocomplete="off">
          </el-input>
          <el-button class="btn" type="primary" @click="submit" :loading="loginLoading"
          >{{ $t('loginBtn') }}
          </el-button>
          <el-button class="btn" v-if="settingStore.settings.linuxdoSwitch"  style="margin-top: 10px"  @click="linuxDoLogin">
            <el-avatar src="/image/linuxdo.webp" :size="18" style="margin-right: 10px" />LinuxDo
          </el-button>
        </div>
        <div v-show="show !== 'login'">
          <el-input class="email-input" v-model="registerForm.email" type="text" :placeholder="$t('emailAccount')" :aria-label="$t('emailAccount')"
                    autocomplete="off">
            <template #append>
              <div @click.stop="openSelect">
                <el-select
                    v-if="show !== 'login'"
                    ref="mySelect"
                    v-model="suffix"
                    :placeholder="$t('select')"
                    class="select"
                >
                  <el-option
                      v-for="item in domainList"
                      :key="item"
                      :label="item"
                      :value="item"
                  />
                </el-select>
                <div>
                  <span>{{ suffix }}</span>
                  <Icon class="setting-icon" icon="mingcute:down-small-fill" width="20" height="20"/>
                </div>
              </div>
            </template>
          </el-input>
          <el-input v-model="registerForm.password" :placeholder="$t('password')" :aria-label="$t('password')" type="password" autocomplete="off"/>
          <el-input v-model="registerForm.confirmPassword" :placeholder="$t('confirmPwd')" :aria-label="$t('confirmPwd')" type="password"
                    autocomplete="off"/>
          <el-input v-if="settingStore.settings.regKey === 0" v-model="registerForm.code" :placeholder="$t('regKey')"
                    type="text" autocomplete="off"/>
          <el-input v-if="settingStore.settings.regKey === 2" v-model="registerForm.code"
                    :placeholder="$t('regKeyOptional')" type="text" autocomplete="off"/>
          <div v-show="verifyShow"
               class="register-turnstile"
               :data-sitekey="settingStore.settings.siteKey"
               data-callback="onTurnstileSuccess"
               data-error-callback="onTurnstileError"
               data-after-interactive-callback="loadAfter"
               data-before-interactive-callback="loadBefore"
          >
            <span style="font-size: 12px;color: #F56C6C" v-if="botJsError">{{ $t('verifyModuleFailed') }}</span>
          </div>
          <el-button class="btn" style="margin: 0" type="primary" @click="submitRegister" :loading="registerLoading"
          >{{ $t('regBtn') }}
          </el-button>
          <el-button v-if="settingStore.settings.linuxdoSwitch" class="btn" style="margin-top: 10px"  @click="linuxDoLogin">
            <el-avatar src="/image/linuxdo.webp" :size="18" style="margin-right: 10px" />LinuxDo
          </el-button>
        </div>
        <template v-if="settingStore.settings.register === 0">
          <button type="button" class="switch" @click="show = 'register'" v-if="show === 'login'">{{ $t('noAccount') }}
            <span>{{ $t('regSwitch') }}</span></button>
          <button type="button" class="switch" @click="show = 'login'" v-else>{{ $t('hasAccount') }} <span>{{ $t('loginSwitch') }}</span>
          </button>
        </template>
      </div>
    </div>
    <el-dialog class="bind-dialog" v-model="showBindForm"  title="注册邮箱" >
      <div class="bind-container">
        <el-input v-model="bindForm.email" type="text" :placeholder="$t('emailAccount')" :aria-label="$t('emailAccount')" autocomplete="off">
          <template #append>
            <div @click.stop="openSelect">
              <el-select
                  ref="mySelect"
                  v-model="suffix"
                  :placeholder="$t('select')"
                  class="select"
              >
                <el-option
                    v-for="item in domainList"
                    :key="item"
                    :label="item"
                    :value="item"
                />
              </el-select>
              <div>
                <span>{{ suffix }}</span>
                <Icon class="setting-icon" icon="mingcute:down-small-fill" width="20" height="20"/>
              </div>
            </div>
          </template>
        </el-input>
        <el-input v-if="settingStore.settings.regKey === 0" v-model="bindForm.code" :placeholder="$t('regKey')"
                  type="text" autocomplete="off"/>
        <el-input v-if="settingStore.settings.regKey === 2" v-model="bindForm.code"
                  :placeholder="$t('regKeyOptional')" type="text" autocomplete="off"/>
        <el-button class="btn" type="primary" @click="bind" :loading="bindLoading"
        >绑定
        </el-button>
      </div>
    </el-dialog>
    <footer class="login-footer"><span>GERRY ZHAO / MAIL</span><a href="https://github.com/maillab/cloud-mail">Cloud Mail <span aria-hidden="true">↗</span></a></footer>
  </div>
</template>

<script setup>
import router from "@/router";
import {computed, nextTick, reactive, ref} from "vue";
import {login} from "@/request/login.js";
import {register} from "@/request/login.js";
import {isEmail} from "@/utils/verify-utils.js";
import {useSettingStore} from "@/store/setting.js";
import {useAccountStore} from "@/store/account.js";
import {useUserStore} from "@/store/user.js";
import {useUiStore} from "@/store/ui.js";
import {Icon} from "@iconify/vue";
import {cvtR2Url} from "@/utils/convert.js";
import {loginUserInfo} from "@/request/my.js";
import {permsToRouter} from "@/perm/perm.js";
import {useI18n} from "vue-i18n";
import {oauthBindUser, oauthLinuxDoLogin} from "@/request/ouath.js";

const {t} = useI18n();
const accountStore = useAccountStore();
const userStore = useUserStore();
const uiStore = useUiStore();
const settingStore = useSettingStore();
const loginLoading = ref(false)
const bindLoading = ref(false)
const oauthLoading = ref(false);
const showBindForm = ref(false);
const show = ref('login')

const bindForm = reactive({
  email: '',
  oauthUserId: '',
  code: ''
})

const form = reactive({
  email: '',
  password: '',

});
const mySelect = ref()
const suffix = ref('')
const registerForm = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  code: null
})
const domainList = settingStore.domainList;
const registerLoading = ref(false)
suffix.value = domainList[0]
const verifyShow = ref(false)
let verifyToken = ''
let turnstileId = null
let botJsError = ref(false)
let verifyErrorCount = 0

window.onTurnstileSuccess = (token) => {
  verifyToken = token;
};

window.onTurnstileError = (e) => {
  if (verifyErrorCount >= 4) {
    return
  }
  verifyErrorCount++
  console.warn('人机验加载失败', e)
  setTimeout(() => {
    nextTick(() => {
      if (!turnstileId) {
        turnstileId = window.turnstile.render('.register-turnstile')
      } else {
        window.turnstile.reset(turnstileId);
      }
    })
  }, 1500)
};

window.loadAfter = (e) => {
  console.log('loadAfter')
}

window.loadBefore = (e) => {
  console.log('loadBefore')
}

const loginOpacity = computed(() => {
  const opacity = Number(settingStore.settings.loginOpacity)
  return settingStore.settings.background && Number.isFinite(opacity)
      ? `color-mix(in srgb, var(--mail-panel) ${Math.min(1, Math.max(0, opacity)) * 100}%, transparent)`
      : 'var(--mail-panel)'
})

const background = computed(() => {

  return settingStore.settings.background ? {
    'background-image': `url(${cvtR2Url(settingStore.settings.background)})`,
    'background-repeat': 'no-repeat',
    'background-size': 'cover',
    'background-position': 'center'
  } : ''
})

const openSelect = () => {
  mySelect.value.toggleMenu()
}

function linuxDoLogin() {
  const clientId = settingStore.settings.linuxdoClientId
  const redirectUri = encodeURIComponent(settingStore.settings.linuxdoCallbackUrl)
  window.location.href =
      `https://connect.linux.do/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid+profile+email`
}

linuxDoGetUser();

async function linuxDoGetUser() {

  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')

  if (code) {

    oauthLoading.value = true
    oauthLinuxDoLogin(code).then(data => {

      bindForm.oauthUserId = data.userInfo.oauthUserId;

      if (!data.token) {
        showBindForm.value = true
        oauthLoading.value = false
        ElMessage({
          message: '请注册绑定一个邮箱',
          type: 'warning',
          duration: 4000,
          plain: true,
        })
        return;
      }

      saveToken(data.token);
    }).catch(() => {
      oauthLoading.value = false
    })
  }

  const cleanUrl = window.location.origin + window.location.pathname
  window.history.replaceState({}, '', cleanUrl)
}

function bind() {

  if (!bindForm.email) {
    ElMessage({
      message: t('emptyEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }


  if (bindForm.email.length < settingStore.settings.minEmailPrefix) {
    ElMessage({
      message: t('minEmailPrefix', {msg: settingStore.settings.minEmailPrefix}),
      type: 'error',
      plain: true,
    })
    return
  }

  let email = bindForm.email + suffix.value;


  if (!isEmail(email)) {
    ElMessage({
      message: t('notEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (settingStore.settings.regKey === 0) {

    if (!bindForm.code) {

      ElMessage({
        message: t('emptyRegKeyMsg'),
        type: 'error',
        plain: true,
      })
      return
    }

  }

  const form = {email: bindForm.email + suffix.value, oauthUserId: bindForm.oauthUserId, code: bindForm.code}

  bindLoading.value = true
  oauthBindUser(form).then(data => {
    saveToken(data.token)
  }).catch(() => {
    bindLoading.value = false
  })
}

const submit = () => {

  if (!form.email) {
    ElMessage({
      message: t('emptyEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  let email = form.email + (settingStore.settings.loginDomain === 0 ? suffix.value : '');

  if (!isEmail(email)) {
    ElMessage({
      message: t('notEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (!form.password) {
    ElMessage({
      message: t('emptyPwdMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  loginLoading.value = true
  login(email, form.password).then(async data => {
    await saveToken(data.token)
  }).finally(() => {
    loginLoading.value = false
  })
}

async function saveToken(token) {
  localStorage.setItem('token', token)
  const user = await loginUserInfo();
  accountStore.currentAccountId = user.account.accountId;
  accountStore.currentAccount = user.account;
  userStore.user = user;
  const routers = permsToRouter(user.permKeys);
  routers.forEach(routerData => {
    router.addRoute('layout', routerData);
  });
  await router.replace({name: 'layout'})
  uiStore.showNotice()
  oauthLoading.value = false;
  bindLoading.value = false;
}


function submitRegister() {

  if (!registerForm.email) {
    ElMessage({
      message: t('emptyEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  console.log(registerForm.email)

  if (registerForm.email.length < settingStore.settings.minEmailPrefix) {
    ElMessage({
      message: t('minEmailPrefix', {msg: settingStore.settings.minEmailPrefix}),
      type: 'error',
      plain: true,
    })
    return
  }

  if (!isEmail(registerForm.email + suffix.value)) {
    ElMessage({
      message: t('notEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (!registerForm.password) {
    ElMessage({
      message: t('emptyPwdMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (registerForm.password.length < 6) {
    ElMessage({
      message: t('pwdLengthMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (registerForm.password !== registerForm.confirmPassword) {

    ElMessage({
      message: t('confirmPwdFailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (settingStore.settings.regKey === 0) {

    if (!registerForm.code) {

      ElMessage({
        message: t('emptyRegKeyMsg'),
        type: 'error',
        plain: true,
      })
      return
    }

  }

  if (!verifyToken && (settingStore.settings.registerVerify === 0 || (settingStore.settings.registerVerify === 2 && settingStore.settings.regVerifyOpen))) {
    if (!verifyShow.value) {
      verifyShow.value = true
      nextTick(() => {
        if (!turnstileId) {
          try {
            turnstileId = window.turnstile.render('.register-turnstile')
          } catch (e) {
            botJsError.value = true
            console.log('人机验证js加载失败')
          }
        } else {
          window.turnstile.reset('.register-turnstile')
        }
      })
    } else if (!botJsError.value) {
      ElMessage({
        message: t('botVerifyMsg'),
        type: "error",
        plain: true
      })
    }
    return;
  }

  registerLoading.value = true

  const form = {
    email: registerForm.email + suffix.value,
    password: registerForm.password,
    token: verifyToken,
    code: registerForm.code
  }

  register(form).then(({regVerifyOpen}) => {
    show.value = 'login'
    registerForm.email = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
    registerForm.code = ''
    registerLoading.value = false
    verifyToken = ''
    settingStore.settings.regVerifyOpen = regVerifyOpen
    verifyShow.value = false
    ElMessage({
      message: t('regSuccessMsg'),
      type: 'success',
      plain: true,
    })
  }).catch(res => {

    registerLoading.value = false

    if (res.code === 400) {
      verifyToken = ''
      settingStore.settings.regVerifyOpen = true
      if (turnstileId) {
        window.turnstile.reset(turnstileId)
      } else {
        nextTick(() => {
          turnstileId = window.turnstile.render('.register-turnstile')
        })
      }
      verifyShow.value = true

    }
  });
}

</script>


<style>
.el-select-dropdown__item {
  padding: 0 15px;
}

.no-autofill-pwd {
  .el-input__inner {
    -webkit-text-security: disc !important;
  }
}
</style>

<style lang="scss" scoped>
#login-box { position: relative; isolation: isolate; min-height: 100dvh; display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(340px, .85fr); grid-template-rows: auto 1fr auto; gap: 24px 8vw; padding-inline: clamp(24px, 5vw, 88px); background: var(--mail-page); overflow: hidden; }
.login-custom-background { position: absolute; inset: 0; z-index: -1; opacity: .16; pointer-events: none; }
.login-brandbar { grid-column: 1/-1; min-height: 104px; display: flex; align-items: center; justify-content: space-between; gap: 24px; border-bottom: 1px solid var(--mail-rule); }
.login-home { font-size: 12px; text-decoration: none; color: var(--mail-muted); min-height: 44px; display: inline-flex; align-items: center; gap: 16px; }
.login-home span { color: var(--mail-accent); }
.login-intro { align-self: center; min-width: 0; padding-block: 48px; }
.login-eyebrow { display: flex; align-items: center; gap: 14px; font-size: 11px; letter-spacing: .16em; color: var(--mail-accent); }
.login-eyebrow > span { width: 30px; height: 1px; background: var(--mail-accent); }
.login-intro h1 { font: clamp(64px, 7.3vw, 110px)/1.03 var(--mail-serif); font-weight: 400; letter-spacing: -.065em; color: var(--mail-text); margin-block: 28px; }
.login-intro h1 > span { color: var(--mail-accent); }
.login-note { color: var(--mail-muted); font-size: 13px; line-height: 1.9; }
.correspondence-mark { display: flex; align-items: baseline; justify-content: space-between; max-width: 430px; margin-top: 75px; padding-top: 20px; border-top: 1px solid var(--mail-rule); color: var(--mail-muted); font-size: 10px; letter-spacing: .1em; }
.correspondence-mark > span:first-child { font: 26px var(--mail-serif); color: var(--mail-accent); letter-spacing: -.05em; }
.form-wrapper { min-width: 0; width: 100%; max-width: 440px; align-self: center; justify-self: end; padding-block: 36px; }
.container { background: v-bind(loginOpacity); border: 1px solid var(--mail-rule); padding: clamp(26px, 3vw, 44px); min-width: 0; display: flex; flex-direction: column; }
.form-eyebrow { font-size: 10px; letter-spacing: .16em; color: var(--mail-accent); margin-bottom: 14px; }
.form-title { font: 42px/1.1 var(--mail-serif); font-weight: 400; letter-spacing: -.045em; color: var(--mail-text); overflow-wrap: anywhere; }
.form-title > span { color: var(--mail-accent); }
.form-desc { color: var(--mail-muted); font-size: 12px; line-height: 1.7; margin-block: 14px 28px; }
.container .el-input { width: 100%; height: 46px; margin-bottom: 16px; }
.container :deep(.el-input__wrapper) { border-radius: 2px; background: var(--mail-panel); }
.container :deep(.el-input__inner) { height: 44px; font-size: 13px; }
.container .btn { width: 100%; min-height: 46px; border-radius: 2px; font-weight: 500; letter-spacing: .05em; }
.container .switch { margin-top: 24px; padding-block: 10px; min-height: 44px; text-align: center; color: var(--mail-muted); font-size: 12px; cursor: pointer; }
.container .switch span { color: var(--mail-accent); margin-left: 6px; border-bottom: 1px solid var(--mail-rule); padding-bottom: 3px; }
.container :deep(.el-input-group__append) { padding: 0 8px; background: var(--mail-panel); border-radius: 0 2px 2px 0; font-size: 12px; }
.container :deep(.el-button + .el-button) { margin-left: 0; }
.container .email-input :deep(.el-input__wrapper) { border-radius: 2px 0 0 2px; }
.setting-icon { position: relative; top: 4px; }
.select { position: absolute; right: 30px; width: 100px; opacity: 0; pointer-events: none; }
.register-turnstile { margin-bottom: 18px; max-width: 100%; overflow: auto; }
.bind-container { display: grid; grid-template-columns: minmax(0, 1fr); gap: 15px; }
:deep(.bind-dialog) { width: min(400px, calc(100% - 32px)); }
.login-footer { grid-column: 1/-1; display: flex; align-items: center; justify-content: space-between; gap: 20px; min-height: 72px; border-top: 1px solid var(--mail-rule); color: var(--mail-muted); font-size: 10px; letter-spacing: .1em; }
.login-footer a { display: inline-flex; align-items: center; gap: 12px; min-height: 44px; color: var(--mail-muted); text-decoration: none; }
.login-footer a span { color: var(--mail-accent); }
@media (max-width: 1000px) { #login-box { gap: 24px 5vw; grid-template-columns: minmax(0, 1fr) minmax(320px, 1fr); padding-inline: 32px; } .login-intro h1 { font-size: clamp(56px, 7vw, 80px); } .correspondence-mark { margin-top: 48px; } }
@media (max-width: 767px) { #login-box { grid-template-columns: minmax(0, 1fr); gap: 20px; padding-inline: max(22px, env(safe-area-inset-left)) max(22px, env(safe-area-inset-right)); } .login-brandbar { min-height: 80px; } .login-home { gap: 8px; font-size: 11px; } .login-intro { padding: 12px 0 0; } .login-eyebrow { font-size: 10px; } .login-intro h1 { font-size: clamp(40px, 9.7vw, 66px); margin-block: 16px 0; } .login-intro h1 br { display: none; } .login-note, .correspondence-mark { display: none; } .form-wrapper { justify-self: center; max-width: 440px; padding: 0 0 12px; } .container { padding: 28px 24px; } .form-title { font-size: 36px; } .form-desc { margin-block: 12px 22px; } .login-footer { min-height: 60px; font-size: 9px; } }
@media (max-width: 360px) { #login-box { padding-inline: 16px; } .container { padding: 26px 20px; } .login-brandbar .mail-brand { gap: 8px; } .login-intro h1 { font-size: 38px; } }
</style>
