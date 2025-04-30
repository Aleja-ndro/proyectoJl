export default function calcularTotalFac(){ 

const calcularTotalFacturado = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('total');
      
      if (!error && data) {
        const total = data.reduce((sum, ticket) => sum + ticket.total, 0);
        setTotalFacturado(total);
      }
    } catch (error) {
      console.error("Error calculando total facturado:", error);
    }
  };
}