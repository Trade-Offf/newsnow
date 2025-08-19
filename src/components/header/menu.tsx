import { motion } from "framer-motion"

// function ThemeToggle() {
//   const { isDark, toggleDark } = useDark()
//   return (
//     <li onClick={toggleDark} className="cursor-pointer [&_*]:cursor-pointer transition-all">
//       <span className={$("inline-block", isDark ? "i-ph-moon-stars-duotone" : "i-ph-sun-dim-duotone")} />
//       <span>
//         {isDark ? "浅色模式" : "深色模式"}
//       </span>
//     </li>
//   )
// }

// 处理不同类型的头像URL
function getAvatarUrl(avatar: string | undefined) {
  if (!avatar) return ""

  // Google头像
  if (avatar.includes("googleusercontent.com")) {
    return `${avatar}`
  }

  // GitHub头像
  if (avatar.includes("github") || avatar.includes("avatars")) {
    return `${avatar}`
  }

  // 其他头像直接返回
  return avatar
}

export function Menu() {
  const { loggedIn, login, logout, userInfo, enableLogin, providers } = useLogin()
  const [shown, show] = useState(false)

  return (
    <span className="relative" onMouseEnter={() => show(true)} onMouseLeave={() => show(false)}>
      <span className="flex items-center scale-90">
        {
          enableLogin && loggedIn && userInfo.avatar
            ? (
                <div className="relative w-10">
                  <img
                    src={getAvatarUrl(userInfo.avatar)}
                    alt="用户头像"
                    className="h-8 w-8 rounded-full border-2 border-transparent hover:border-primary transition-all duration-200 cursor-pointer object-cover"
                    title={`已登录: ${userInfo.name || "用户"}`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23999' d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E"
                    }}
                  />
                </div>
              )
            : <button type="button" className="btn i-si:more-muted-horiz-circle-duotone" />
        }
      </span>
      {shown && (
        <div className="absolute right-0 z-99 bg-transparent pt-4 top-4">
          <motion.div
            id="dropdown-menu"
            className={$([
              "w-200px",
              "bg-primary backdrop-blur-5 bg-op-70! rounded-lg shadow-xl",
            ])}
            initial={{
              scale: 0.9,
            }}
            animate={{
              scale: 1,
            }}
          >
            <ol className="bg-base bg-op-70! backdrop-blur-md p-2 rounded-lg color-base text-base">
              {enableLogin && (loggedIn
                ? (
                    <>
                      {/* 用户信息显示 */}
                      <li className="no-hover py-2 border-b border-base border-op-20 mb-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={getAvatarUrl(userInfo.avatar)}
                            alt="用户头像"
                            className="w-8 h-8 rounded-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'%3E%3Cpath fill='%23999' d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E"
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {userInfo.name || "用户"}
                            </div>
                            <div className="text-xs text-base text-op-60">
                              已登录
                            </div>
                          </div>
                        </div>
                      </li>
                      {/* 退出登录按钮 */}
                      <li onClick={logout} className="px-3 py-2">
                        <span className="i-ph:sign-out-duotone inline-block" />
                        <span>退出登录</span>
                      </li>
                    </>
                  )
                : (
                    <>
                      {providers.map(provider => (
                        <li key={provider.name} onClick={() => login(provider.name)} className="px-3 py-2">
                          <span className={provider.name === "github" ? "i-ph:github-logo-duotone" : "i-ph:google-logo-duotone"} />
                          <span>{provider.name === "github" ? "Github 账号登录" : "Google 账号登录"}</span>
                        </li>
                      ))}
                      {providers.length === 0 && (
                        <li onClick={() => login()} className="px-3 py-2">
                          <span className="i-ph:sign-in-duotone" />
                          <span>登录</span>
                        </li>
                      )}
                    </>
                  ))}
            </ol>
          </motion.div>
        </div>
      )}
    </span>
  )
}
