import { useState, useEffect } from 'react';

export const Crear = ({ open, close, actualizarDatos}) => {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [categoria, setCategoria] = useState('');
    const [descripcion, setDescripcion] = useState('');
    
    const [categorias, setCategorias] = useState([]);  
    const [errores, setErrores] = useState({});


    // Llamada a la API para obtener las categorías al cargar el componente
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/categorias');  
                if (response.ok) {
                    const data = await response.json();
                    setCategorias(data);  
                } else {
                    console.error('Error al obtener las categorías');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchCategorias();
    }, []);

    const validarFormulario = () => {
        const nuevosErrores = {};
        if (!nombre.trim()) nuevosErrores.nombre = 'El nombre del producto es obligatorio';
        if (!precio || isNaN(precio) || parseFloat(precio) <= 0) nuevosErrores.precio = 'El precio debe ser un número positivo mayor que cero';
        if (!categoria) nuevosErrores.categoria = 'Debe seleccionar una categoría';
        if (!descripcion.trim()) nuevosErrores.descripcion = 'La descripción del producto es obligatoria';
        
        setErrores(nuevosErrores);
        
        // Mostrar errores durante 4 segundos
        setTimeout(() => setErrores({}), 4000);
        
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    

        if (!validarFormulario()) return;
        // Crear el cuerpo de la solicitud
        const productData = {
            Nombre: nombre,
            Categoria: categoria,
            Precio: parseFloat(precio).toFixed(2),  
            Descripcion: descripcion,
        };
    
        try {
            const response = await fetch('http://localhost:5000/api/crearProducto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });
    
            // Si la respuesta es exitosa
            if (response.ok) {
                alert('Producto creado correctamente');
                close();  
                actualizarDatos();  
                resetForm(); 
            } else {
                alert('Error al crear el producto');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error en la conexión con el servidor');
        }
    };
    
   
    const resetForm = () => {
        setNombre('');
        setPrecio('');
        setCategoria('');
        setDescripcion('');
    };

    return (
        <>
            {open && <div className="fixed inset-0 bg-black opacity-50 z-40" aria-hidden="true"></div>}
            <div className={`fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${open ? 'flex' : 'hidden'}`}>
                <div className="relative p-4 w-full max-w-md max-h-full flex">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <div className="w-full text-center">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Crear Nuevo Producto
                                </h3>
                            </div>
                            <button type="button" onClick={() => { close(); resetForm(); }}
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                data-modal-toggle="crud-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className="col-span-2">
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre Producto</label>
                                    <input type="text" name="name" value={nombre}
                                        onChange={(e) => setNombre(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Ingrese Nombre de producto" required="" />
                                         {errores.nombre && <p className="text-red-500 text-sm mt-1 text-center">{errores.nombre}</p>}
                                </div>

                               

                                
                                <div className="col-span-2 sm:col-span-1">
                                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Precio</label>
                                    <input 
                                        type="text" 
                                        name="price" 
                                        value={precio}
                                        onChange={(e) => setPrecio(e.target.value)} 
                                        onKeyPress={(e) => {
                                            const charCode = e.charCode;           
                                            if ((charCode < 48 || charCode > 57) && charCode !== 46) {
                                                e.preventDefault();
                                            }
                                        }}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                        placeholder="S/00" 
                                        required 
                                    />
                                    {errores.precio && <p className="text-red-500 text-sm mt-1 text-center">{errores.precio}</p>}
                                </div>




                                <div className="col-span-2 sm:col-span-1">
                                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Categoria</label>
                                    <select id="category" value={categoria} onChange={(e) => setCategoria(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                        <option value="">Seleccione Categoria</option>
                                        {categorias.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.Nombre}</option>  
                                        ))}
                                    </select>
                                    {errores.categoria && <p className="text-red-500 text-sm mt-1 text-center">{errores.categoria}</p>}
                                </div>

                                <div className="col-span-2">
                                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripcion de Producto</label>
                                    <textarea id="description" rows="4" value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Escribe la descripción del producto aquí"></textarea>
                                         {errores.descripcion && <p className="text-red-500 text-sm mt-1 text-center">{errores.descripcion}</p>}
                                </div>

                            </div>

                            <div className="flex justify-center mt-4">
                                <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                                    </svg>
                                    Agregar Nuevo Producto
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Crear;
