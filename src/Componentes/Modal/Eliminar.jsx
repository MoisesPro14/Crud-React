import { FaTrashCan } from "react-icons/fa6";


export const Eliminar = ({open, close , idProducto, actualizarDatos}) => {

        
    const handleEliminar = async () => {    
        try {
            const response = await fetch(`http://localhost:5000/api/eliminar/${idProducto}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                alert("Producto eliminado con éxito.");
                actualizarDatos();
                close();
            } else {
                
                alert("Hubo un error al eliminar el producto.");
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            alert("Ocurrió un error inesperado.");
        }
    };
    
    

    return (
        <>
            {open && <div className='fixed inset-0 bg-black opacity-50 z-40' aria-hidden="true"></div>}         
            <div className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full
            ${open ? 'flex' : 'opacity-0 pointer-events-none'}`}>
                <div className="relative p-4 w-full max-w-md h-auto md:h-auto">
                    <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                        <FaTrashCan className="text-gray-400 dark:text-gray-500 w-10 h-10 mb-3.5 mx-auto" />
                        <p className="mb-4 text-gray-500 dark:text-gray-300">
                            ¿Estás seguro de eliminar el Producto Registrado?
                        </p>
                        <div className="flex justify-center items-center space-x-4">
                            <button onClick={close} type="button"   className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 bg-white border rounded-lg hover:bg-gray-100">
                                No, Cancelar
                            </button>                   
                            <button  onClick={handleEliminar}
                                type="button" className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900" >
                                Sí, Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Eliminar