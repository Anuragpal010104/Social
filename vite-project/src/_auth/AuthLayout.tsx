import { Outlet, Navigate } from 'react-router-dom'

const AuthLayout = () => {
  const isAuthenticated = false;
  return (
    <>
      {isAuthenticated ? (
      <Navigate to='/' />
      ) : (
        <>
        <section className='flex flex-1 justify-center items-center flex-col py-10 '>
          <Outlet />
        </section>
        <img
         src="/assets/images/side-img.svg"
         alt='logo'
         className='hiiden xl:block h-screen w-1/2 object-cover bg-no-repeat bg-center'
        />
        </> 
         )}
    </>
  )
}

export default AuthLayout