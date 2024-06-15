import MaxWidthWrapper from './MaxWidthWrapper'
import { buttonVariants } from './ui/button'
import { ArrowRight } from 'lucide-react'
import AIDocsMobileNavbar from './AIDocsMobileNavbar'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import authState from '../recoil/atoms/auth'
import UserAccountNav from './UserAccountNavbar'
import userState from '../recoil/atoms/user'

const AIDocsNavbar = () => {

  const user = useRecoilValue(userState);
  const auth = useRecoilValue(authState);

  return ( 
    <nav className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 opacity-95 bg-white/75 backdrop-blur-xl transition-all'>
      <MaxWidthWrapper>
        <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
          <Link
            to='/'
            className='flex z-40 font-semibold'>
            <span>PlacePrep</span>
          </Link>

          <AIDocsMobileNavbar isAuth={auth.isAuthenticated} />

          <div className='hidden items-center space-x-4 sm:flex'>
            {!auth.isAuthenticated ? (
              <>
                <Link
                  to='/pricing'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Pricing
                </Link>
                <Link
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })} to={'/login'}>
                  Sign in
                </Link>
                <Link
                  className={buttonVariants({
                    size: 'sm',
                  })} to={'/signup'}>
                  Get started{' '}
                  <ArrowRight className='ml-1.5 h-5 w-5' />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to='/dashboard'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Dashboard
                </Link>

                <Link
                  to={`/u/${user.id}`}
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Profile
                </Link>

                <UserAccountNav
                  name={
                    user.name
                  }
                  email={user.email ?? ''}
                  imageUrl={user.imageUrl ?? ''}
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default AIDocsNavbar