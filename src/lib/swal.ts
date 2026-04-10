import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const showToast = (title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  MySwal.fire({
    title,
    icon,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#fefae0', // --background
    color: '#283618', // --foreground
    iconColor: icon === 'success' ? '#5c6e58' : undefined, // --primary
    customClass: {
      popup: 'swal-glass'
    }
  });
};

export const showAlert = (title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  return MySwal.fire({
    title,
    text,
    icon,
    background: '#fefae0',
    color: '#283618',
    confirmButtonColor: '#5c6e58', // --primary
    cancelButtonColor: '#d4a373', // --secondary
    customClass: {
      popup: 'swal-glass',
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-secondary'
    },
    buttonsStyling: false
  });
};

export const showConfirm = (title: string, text: string, confirmButtonText: string = 'Sim', cancelButtonText: string = 'Não') => {
  return MySwal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    background: '#fefae0',
    color: '#283618',
    confirmButtonColor: '#5c6e58',
    cancelButtonColor: '#d4a373',
    customClass: {
      popup: 'swal-glass',
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-secondary',
      actions: 'swal-actions-gap'
    },
    buttonsStyling: false
  });
};

export default MySwal;
