import { Fragment } from "react"
import { TaskProject} from "@/types/index"
import {Menu, Transition} from '@headlessui/react'
import {EllipsisVerticalIcon} from "@heroicons/react/20/solid"
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { deleteTask } from '@/api/TaskAPI'
import { useDraggable } from '@dnd-kit/core'


type TaskCardProps = {
    task: TaskProject //Task
    canEdit: boolean
}

export default function TaskCard({task, canEdit} : TaskCardProps) {

    const { attributes, listeners, setNodeRef, transform  } = useDraggable({  // UseDraggable es lo que se va a arrastrar
        id: task._id  // el draggable va a ser el task._id
    })

    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId! // Con ! se garantiza que siempre va a estar el valor y que no sea undefined

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: deleteTask,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['project', projectId] }) // Se le pasa este y no el de editprojectview que era queryKey: ['editProject', projectId],
        }
    })


    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        /*padding: "1.25rem",
        backgroundColor: '#FFF',
        width: '300px',
        display: 'flex',
        borderWidth: '1px',
        borderColor: 'rgb(203 213 225 / var(--tw-border-opacity))'*/
    } : undefined


/*

translateX permite mover el objeto de izquierda a derecha
transform: `translateX(${transform.x}px)`,
Para mover las tareas de arriba a abajo
transform: `translateY(${transform.y}px)`,
Con translate3d se mueve por toda la pantalla
translate3d(${transform.x}px, ${transform.y}px, 0)


Aqui se inyecta todo lo de Draggable


        <div 
            {...listeners}      Aqui se inyecta todo lo de Draggable para identificar que es en este div que se va a usar el usedraggable
            {...attributes}     Aqui se inyecta todo lo de Draggable
            ref={setNodeRef}    Este indica que elemento se va a usar para el drag
        className=" min-w-0 flex flex-col gap-y-4">



        
           return (
    <li 
    className="p-5 bg-white border border-slate-300 flex justify-between gap-3">
        <div 
            {...listeners}
            {...attributes}
            ref={setNodeRef}
            style={style}
        className=" min-w-0 flex flex-col gap-y-4">
*/





   return (
    <li 
    className="p-5 bg-white border border-slate-300 flex justify-between gap-3">
        <div 
            {...listeners}
            {...attributes}
            ref={setNodeRef}
            style={style}
        className=" min-w-0 flex flex-col gap-y-4">
            <button
            type="button"
            className="text-xl font-bold text-slate-600 text-left"
            >
                {task.name}
            </button>
            <p className="text-slate-50">{task.description}</p>
        </div>

        <div className="flex shrink-0  gap-x-6">
            <Menu as="div" className="relative flex-none">
                <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <span className="sr-only">opciones</span>
                    <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                </Menu.Button>
                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                    <Menu.Items
                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        <Menu.Item>
                            <button type='button' className='block px-3 py-1 text-sm leading-6 text-gray-900'
                            onClick={() => navigate(location.pathname + `?viewTask=${task._id}`)}
                            >
                                Ver Tarea
                            </button>
                        </Menu.Item>

                        {canEdit && (
                            <>
                                <Menu.Item>
                                    <button type='button' className='block px-3 py-1 text-sm leading-6 text-gray-900'
                                        onClick={() => navigate(location.pathname + `?editTask=${task._id}`)}
                                    >
                                        Editar Tarea
                                    </button>
                                </Menu.Item>

                                <Menu.Item>
                                    <button
                                        type='button'
                                        className='block px-3 py-1 text-sm leading-6 text-red-500'
                                        onClick={() => mutate({ projectId, taskId: task._id })}
                                    >
                                        Eliminar Tarea
                                    </button>
                                </Menu.Item>
                            </>
                        )}
 
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>  
    </li>
  )
}