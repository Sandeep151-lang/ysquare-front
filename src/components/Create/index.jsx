import React, { useEffect, useState } from 'react'
import Table from '../../Shared/Table'
import CourseColumn from './coloumn'
import DrawerWrapper from '../../Shared/DrawerWrapper'
import Input from '../../Shared/Input'
import axios from 'axios'
import { useForm } from 'react-hook-form'
const Crud = () => {
  const [open, setOpen] = useState(false)
  const [updateData, setUpdateData] = useState()
  const [datas, setData] = useState([])

  const defaultValue = {
    id: undefined,
    firstName: undefined,
  }

  const { register, handleSubmit, setValue, watch, reset,formState:{errors} } = useForm({
    mode: ' onChange',
    reValidateMode: 'onTouched',
    defaultValue,
  })

  const getList = async () => {
    try {
      const resp = await axios.get(`http://localhost:2000/user/list`)
      if (resp) {
        setData(resp?.data)
      }
    } catch (error) {
        console.log(error)
    }
  }

  const onSubmit =async (values) => {
    try {
      const payload = {
        ...values,
      }
      const res =await axios[watch('id') ? 'put' : 'post'](`http://localhost:2000/user/${watch('id') ? `update/${watch('id')}`:'create'}`, payload)
      if (res) {
        getList()
        setOpen(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getList()
  }, [])

  useEffect(() => {
    if (open && updateData?.id) {
      setValue('id', updateData?.original?._id)
      setValue('firstName', updateData?.original?.firstName)
      setValue('lastName',updateData?.original?.lastName)
      setValue('email',updateData?.original?.email)
    }
  }, [open])

  return (
    <>
      <div className="container mx-auto">
        <nav className="h-12 my-2 border border-current bg-slate-200 rounded-md">
          <div className="flex justify-end">
            <div />
            <button
              className="mx-3 bg-black rounded-md text-white py-1 px-5 my-2 hover:bg-blue-600 btn bg-blue-500 text-white leading-6 "
              onClick={() => {
                setUpdateData()
                setOpen(true)
                reset({ ...defaultValue })
              }}
            >
              Create
            </button>
          </div>
        </nav>
        <Table
          data={datas}
          columns={CourseColumn({ datas, setOpen, setUpdateData, getList }).columns}
        />

        <DrawerWrapper
          setOpen={setOpen}
          open={open}
          title={watch('id') ? `Update Detail` : `Add Detail`}
          children={
            <>
              <Input
                label="First Name"
                placeholder="Enter first name"
                value={watch('firstName')}
                rest={register('firstName', { required: true })}
                onChange={(e) => setValue('firstName', e?.target?.value)}
              />
              
              <br />
              <Input
                label="Last Name"
                placeholder="Enter last Name"
                value={watch('lastName')}
                rest={register('lastName', { required: true })}
                onChange={(e) => setValue('lastName', e.target.value)}
              />
              <br />
              <Input
                label="Enter Email"
                type="email"
                placeholder="Enter email"
                value={watch('email')}
                rest={register('email', { required: true })}
                onChange={(e) => setValue('email', e.target.value)}
              />
            </>
          }
          footer={
            <div className="flex row-reverse">
              <button
                className="mx-3 bg-black rounded-md  py-1 px-5 my-2  btn bg-black text-white leading-6 "
                onClick={() => setOpen(false)}
              >
                Close
              </button>
              <button
                className="mx-3 bg-black rounded-md  py-1 px-5 my-2 hover:bg-blue-600 btn bg-blue-500 text-white leading-6 "
                onClick={handleSubmit(onSubmit)}
              >
                {watch('id') ? `Update` : `Create`}
              </button>
            </div>
          }
        />
      </div>
    </>
  )
}

export default Crud
