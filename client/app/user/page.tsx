'use client'
import { useContext, useEffect } from 'react'
import { AuthContext, baseUrl } from '../utility'
import './User.scss'
import { VscChromeClose } from "react-icons/vsc";


export default function User() {
  const { user, loading , setUser} = useContext(AuthContext)


  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    const formData = new FormData()

    formData.append('avatar', file)

    const response = await fetch(`${baseUrl}/auth/avatar`, {
      method: "POST",
      credentials: 'include',
      body: formData
    })

    if (!response.ok) {
      alert(`${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    setUser(data)

  }


  async function deleteAvatar() {
    const response = await fetch(`${baseUrl}/auth/avatar`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if(response.ok){
      const data = await response.json()
      setUser(data)
    }
    else{
      alert(`${response.status}: ${response.statusText}`)
    }
  }



  return (
    <>
      {!loading ? (
        <div className='user'>
          <div className="container">
            <div className="item">
              <label>
                {!user?.avatar &&  <input type="file" accept='image/*' onChange={handleAvatarChange} />}
               
                <img src={user?.avatar ? `${baseUrl}${user.avatar}` : '/svgs/user.svg'} alt="" />
                {user?.avatar && <button onClick={deleteAvatar}><VscChromeClose /></button>}
              </label>
              <span>{user!.username}</span>
            </div>

          </div>
        </div>

      ) : (
        <p>Loading</p>
      )

      }
    </>
  )
}
