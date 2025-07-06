// src/pages/Profile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaEye, FaCamera, FaTrash, FaTimes } from 'react-icons/fa';

export default function Profile() {
  const currentUsername = localStorage.getItem('currentUser');
  const [profile, setProfile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [menuOpen, setMenuOpen]   = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const avatarRef    = useRef(null);
  const menuRef      = useRef(null);
  const fileInputRef = useRef(null);

  // 1) Carga perfil desde json-server
  useEffect(() => {
    fetch(`http://localhost:3001/users?username=${currentUsername}`)
      .then(r => r.json())
      .then(arr => {
        const u = arr[0];
        setProfile({
          id:        u.id,
          username:  u.username,
          password:  '',
          email:     u.email,
          phone:     u.telefono,
          avatarUrl: u.avatarUrl
        });
        setPreview(u.avatarUrl);
      });
  }, [currentUsername]);

  // 2) Cerrar menú si clic fuera
  useEffect(() => {
    const onClick = e => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  // Manejadores del avatar/menú
  const handleAvatarClick = () => setMenuOpen(o => !o);
  const handleViewPhoto   = () => { setModalOpen(true); setMenuOpen(false); };
  const handleChangePhoto = () => { setMenuOpen(false); fileInputRef.current?.click(); };
  const handleDeletePhoto = () => {
    setProfile(p => ({ ...p, avatarUrl: null }));
    setPreview(null);
    setMenuOpen(false);
  };

  // Al elegir archivo
  const handleAvatarFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile(p => ({ ...p, avatarUrl: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Formulario de datos
  const handleChange = e => {
    const { name, value } = e.target;
    setProfile(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Solo enviamos los campos que cambian
    const payload = {
      username:  profile.username,
      email:     profile.email,
      telefono:  profile.phone,
      avatarUrl: profile.avatarUrl
    };
    if (profile.password) {
      payload.password = profile.password;
    }

    await fetch(`http://localhost:3001/users/${profile.id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    // Marcamos guardado y recargamos
    window.location.reload();
  };

  if (!profile) return <div className="p-6">Cargando perfil…</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 relative">
      <h1 className="text-3xl font-bold">Mi Perfil</h1>

      {/* Avatar + menú */}
      <div className="flex items-center space-x-6">
        <div className="relative" ref={avatarRef}>
          {/* Avatar clicable */}
          {preview ? (
            <img
              src={preview}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border cursor-pointer"
              onClick={handleAvatarClick}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center 
                         text-gray-500 border cursor-pointer"
              onClick={handleAvatarClick}
            >
              Sin foto
            </div>
          )}

          {/* Menú desplegable */}
          {menuOpen && (
            <div
              className="absolute top-full mt-2 left-0 bg-white shadow-lg rounded-lg w-48 z-50"
              ref={menuRef}
            >
              <button
                onClick={handleViewPhoto}
                className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100"
              >
                Ver foto <FaEye />
              </button>
              <button
                onClick={handleChangePhoto}
                className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100"
              >
                Cambiar foto <FaCamera />
              </button>
              <button
                onClick={handleDeletePhoto}
                className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Eliminar foto <FaTrash />
              </button>
            </div>
          )}

          {/* Input oculto */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarFile}
          />
        </div>

        {/* ID */}
        <div>
          <div className="text-gray-600">ID de usuario</div>
          <div className="text-xl font-mono">{profile.id}</div>
        </div>
      </div>

      {/* Formulario de datos */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-4"
      >
        {/* Usuario */}
        <div>
          <label className="block mb-1 font-semibold">Usuario</label>
          <input
            name="username"
            value={profile.username}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded 
                       focus:outline-none focus:ring-2 focus:ring-cielo"
            required
          />
        </div>

        {/* Contraseña */}
        <div>
          <label className="block mb-1 font-semibold">Contraseña</label>
          <input
            name="password"
            type="password"
            value={profile.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded 
                       focus:outline-none focus:ring-2 focus:ring-cielo"
            placeholder="••••••••"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            name="email"
            type="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded 
                       focus:outline-none focus:ring-2 focus:ring-cielo"
            required
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="block mb-1 font-semibold">Teléfono</label>
          <input
            name="phone"
            type="tel"
            value={profile.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded 
                       focus:outline-none focus:ring-2 focus:ring-cielo"
          />
        </div>

        <button
          type="submit"
          className="bg-cielo-oscuro text-white px-6 py-2 rounded-lg 
                     hover:bg-cielo transition cursor-pointer"
        >
          Guardar cambios
        </button>
      </form>

      {/* Modal de ver foto */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black flex items-center 
                     justify-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <div className="relative">
            <img
              src={preview}
              alt="Avatar completo"
              className="max-h-screen max-w-full rounded-lg"
            />
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-white bg-gray-800 
                         p-2 rounded-full hover:bg-gray-700 cursor-pointer"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}