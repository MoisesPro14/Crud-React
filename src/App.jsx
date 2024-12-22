import { useState, useEffect } from "react"
import Crear from "./Componentes/Modal/Crear"
import Editar from "./Componentes/Modal/Editar/"
import Eliminar  from "./Componentes/Modal/Eliminar"

function App() {

    const [OpenEliminar, SetOpenEliminar] = useState(false)
    const [OpenEditar, SetOpenEditar] = useState(false)
    const [OpenCrear, SetOpenCrear] =useState (false)
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [idProductoEliminar, setIdProductoEliminar] = useState(null);

    const [productos, setProductos] = useState([]);


	const ToggleCrear = () => SetOpenCrear(!OpenCrear);
	const ToggleEditar = () => SetOpenEditar(!OpenEditar);
	const ToggleEliminar = () => SetOpenEliminar(!OpenEliminar);


    // Función para obtener los datos desde el servidor
    const fetchProductos = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/data");
            const data = await response.json();
            setProductos(data);
        } catch (error) {
            console.error("Error al obtener los productos:", error);
        }
    };

     // Llamar a fetchProductos al cargar el componente
    useEffect(() => {
        fetchProductos();
    }, []);

    // Función para actualizar los productos después de crear uno
    const actualizarDatos = () => {
        fetchProductos();  
    };


      // Función para seleccionar el producto a editar
      const seleccionarProducto = (producto) => {
        setProductoSeleccionado(producto);
        ToggleEditar(); 
    };

    //Funcion para selecionar el producto a eliminar
    const seleccionarProductoEliminar = (id) => {
        setIdProductoEliminar(id);
        ToggleEliminar();
      };
  return (
    <>
        <div className="m-10">

            <button type="button" onClick={() => {ToggleCrear(); actualizarDatos();  }} className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Crear</button>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
                
                <table className="w-full text-sm text-left  bg-gray-950">
                    <thead className="text-xs text-gray-700 uppercase">
                        <tr className="text-white">
                            <th scope="col" className="px-6 py-3">Producto</th>
                            <th scope="col" className="px-6 py-3">Categoría</th>
                            <th scope="col" className="px-6 py-3 hidden">Categoría ID</th>
                            <th scope="col" className="px-6 py-3">Precio</th>
                            <th scope="col" className="px-6 py-3">Descripción</th>
                            <th scope="col" className="px-6 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                       
                            {
                                productos.map((producto) =>(
                                    <tr key={producto.id} className="bg-white border-b ">

                                        <th className="px-6 py-4 font-medium text-gray-900 "> {producto.Nombre}</th>
                                        <th className="px-6 py-4"> {producto.categoria}</th>
                                        <th className="px-6 py-4 hidden"> {producto.categoria_id}</th>
                                        <th className="px-6 py-4"> {`S/${producto.Precio}`}</th>
                                        <th className="px-6 py-4"> {producto.descripcion}</th>
                                        <td className="px-6 py-4 text-center">
                                                <button type="button" onClick={() => seleccionarProducto(producto)}className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Editar</button>
                                                <button type="button"  onClick={() => seleccionarProductoEliminar(producto.id)} className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2s">Eliminar</button>
                                            </td>
                                    </tr>
                                    
                                ))
                            }

                    </tbody>
                </table>
            </div>
        </div>
        <Crear open={OpenCrear} close={() =>SetOpenCrear(false) } actualizarDatos={actualizarDatos} />
        <Editar open={OpenEditar} close={()=>SetOpenEditar(false)} producto={productoSeleccionado} actualizarProducto={actualizarDatos} />
        <Eliminar open={OpenEliminar} close={() => SetOpenEliminar(false)} idProducto={idProductoEliminar} actualizarDatos={actualizarDatos}/>
    </>
  )
}

export default App
