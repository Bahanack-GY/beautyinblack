import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  MapPin, 
  Phone, 
  Mail, 
  User,
  Calendar,
  CreditCard,
  FileText,
  Printer,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { useOrder, useUpdateOrderStatus } from '../hooks/useOrders';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrder(id);
  const [showScreenshot, setShowScreenshot] = useState(false);

  // Données de commande d'exemple (repli)
  const [fallbackOrder, setFallbackOrder] = useState({
    id: id,
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      address: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      }
    },
    date: '2024-01-15',
    status: 'processing',
    payment: {
      method: 'Credit Card',
      status: 'paid',
      transactionId: 'TXN123456789',
      amount: 259.97
    },
    tracking: 'TRK123456789',
    items: [
      {
        id: 1,
        name: 'Parfum Élégance Homme 50ml',
        size: '50ml',
        quantity: 2,
        price: 89.99,
        image: 'https://via.placeholder.com/80'
      },
      {
        id: 2,
        name: 'Parfum Rose Femme 100ml',
        size: '100ml',
        quantity: 1,
        price: 129.99,
        image: 'https://via.placeholder.com/80'
      }
    ],
    timeline: [
      { status: 'Commande passée', date: '2024-01-15 10:30 AM', completed: true },
      { status: 'En traitement', date: '2024-01-15 02:15 PM', completed: true },
      { status: 'Expédiée', date: '', completed: false },
      { status: 'Livrée', date: '', completed: false }
    ],
    notes: 'Please deliver between 9 AM - 5 PM'
  });

  const { mutate: updateStatus } = useUpdateOrderStatus();
  const statusOptions = ['en_cours', 'livraison', 'livre', 'annule'];

  const handleStatusUpdate = (newStatus) => {
    updateStatus({ orderId: id, data: { status: newStatus } });
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  // Utiliser les données de commande réelles ou le repli
  const orderData = order || fallbackOrder || {};
  
  // S'assurer que trackingSteps/timeline est toujours un tableau
  const trackingSteps = orderData?.trackingSteps || orderData?.timeline || [];
  
  const subtotal = orderData.subtotal || (orderData.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0);
  const shipping = orderData.shipping || 5000;
  const total = orderData.total || (subtotal + shipping);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/orders')}
            className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Commande {orderData.id}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Passée le {new Date(orderData.date || orderData.createdAt || Date.now()).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
        <button
          onClick={handlePrintInvoice}
          className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Printer size={20} />
          Imprimer la facture
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Chronologie de la commande</h2>
            <div className="relative">
              {trackingSteps.map((step, index, array) => (
                <div key={index} className="flex gap-4 mb-6 last:mb-0">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-pink-300' 
                        : 'bg-gray-200 dark:bg-gray-800'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="text-white" size={20} />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-gray-400" />
                      )}
                    </div>
                    {index < array.length - 1 && (
                      <div className={`absolute left-1/2 top-10 w-0.5 h-6 -translate-x-1/2 ${
                        step.completed ? 'bg-pink-300' : 'bg-gray-200 dark:bg-gray-800'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{step.label || step.status}</p>
                    {(step.date || step.completedAt) && (
                      <p className="text-sm text-gray-500 mt-1">
                        {step.completedAt 
                          ? new Date(step.completedAt).toLocaleString('fr-FR')
                          : step.date
                        }
                      </p>
                    )}
                    {step.description && (
                      <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Articles de la commande</h2>
            <div className="space-y-4">
              {(orderData.items || []).map((item, idx) => (
                <div key={item.id || idx} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Package size={32} className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Taille: {item.size}</p>
                    <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {((item.price || 0) * (item.quantity || 1)).toLocaleString()} FCFA
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{(item.price || 0).toLocaleString()} FCFA chacun</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 space-y-2">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Sous-total</span>
                <span>{subtotal.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Livraison</span>
                <span>{shipping.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-800">
                <span>Total</span>
                <span>{total.toLocaleString()} FCFA</span>
              </div>
            </div>
          </motion.div>

          {/* Payment Screenshot */}
          {orderData.paymentScreenshot && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon size={20} className="text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Capture d'écran du paiement</h2>
              </div>
              <div className="relative">
                <img
                  src={orderData.paymentScreenshot}
                  alt="Payment screenshot"
                  className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setShowScreenshot(true)}
                />
                <button
                  onClick={() => setShowScreenshot(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors rounded-lg"
                >
                  <div className="bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Cliquer pour agrandir</p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Client</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-300 flex items-center justify-center text-white">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {orderData.customer?.name || 'Client'}
                  </p>
                  <p className="text-sm text-gray-500">Client</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
                {orderData.customer?.email && (
                  <div className="flex items-start gap-3">
                    <Mail size={18} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">E-mail</p>
                      <p className="text-sm text-gray-900 dark:text-white">{orderData.customer.email}</p>
                    </div>
                  </div>
                )}
                {orderData.customer?.phone && (
                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Téléphone</p>
                      <p className="text-sm text-gray-900 dark:text-white">{orderData.customer.phone}</p>
                    </div>
                  </div>
                )}
                {orderData.address && (
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Adresse de livraison</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {orderData.address.fullAddress || 
                         `${orderData.address.street || ''}, ${orderData.address.city || ''}, ${orderData.address.country || ''}`
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Payment Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Paiement</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CreditCard size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Méthode</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {orderData.paymentMethod === 'OM' ? 'Orange Money' : 
                     orderData.paymentMethod === 'MOMO' ? 'MTN Mobile Money' : 
                     orderData.paymentMethod || orderData.payment?.method || 'N/A'}
                  </p>
                </div>
              </div>
              {orderData.paymentScreenshot && (
                <div className="flex items-center gap-3">
                  <ImageIcon size={18} className="text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500">Capture d'écran</p>
                    <button
                      onClick={() => setShowScreenshot(true)}
                      className="text-sm font-medium text-purple-600 hover:underline"
                    >
                      Voir l'image
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Update Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Mettre à jour le statut</h2>
            <select
              value={orderData.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-4"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === 'en_cours' ? 'En cours' : 
                   status === 'livraison' ? 'En livraison' : 
                   status === 'livre' ? 'Livré' : 
                   status === 'annule' ? 'Annulé' : status}
                </option>
              ))}
            </select>
          </motion.div>
        </div>
      </div>

      {/* Payment Screenshot Modal */}
      {showScreenshot && orderData.paymentScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setShowScreenshot(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X size={24} />
            </button>
            <img
              src={orderData.paymentScreenshot}
              alt="Payment screenshot"
              className="w-full h-full object-contain max-h-[90vh]"
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;

