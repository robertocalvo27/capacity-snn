import { Route } from 'react-router-dom';
import ValueStreamDebugPage from './ValueStreamTest';
import ShiftDebugPage from './ShiftTest';
import ProductionLineTest from './ProductionLineTest';
import PartNumberTest from './PartNumberTest';
import ProgrammedStopTest from './ProgrammedStopTest';
import CauseTest from './CauseTest';
import CauseTypeTest from './CauseTypeTest';
import ProductionCauseTest from './ProductionCauseTest';
import ProductionEntryTest from './ProductionEntryTest';
import TargetAdjustmentTest from './TargetAdjustmentTest';
import CalculationTest from './CalculationTest';
import WorkOrderTest from './WorkOrderTest';

export const DebugRoutes = (
  <Route path="/debug">
    <Route 
      path="value-stream-test" 
      element={<ValueStreamDebugPage />} 
    />
    <Route 
      path="shift-test" 
      element={<ShiftDebugPage />} 
    />
    <Route 
      path="production-line-test" 
      element={<ProductionLineTest />} 
    />
    <Route 
      path="part-number-test" 
      element={<PartNumberTest />} 
    />
    <Route 
      path="programmed-stop-test" 
      element={<ProgrammedStopTest />} 
    />
    <Route 
      path="cause-test" 
      element={<CauseTest />} 
    />
    <Route 
      path="cause-type-test" 
      element={<CauseTypeTest />} 
    />
    <Route 
      path="production-cause-test" 
      element={<ProductionCauseTest />} 
    />
    <Route 
      path="production-entry-test" 
      element={<ProductionEntryTest />} 
    />
    <Route 
      path="target-adjustment-test" 
      element={<TargetAdjustmentTest />} 
    />
    <Route 
      path="calculation-test" 
      element={<CalculationTest />} 
    />
    <Route 
      path="work-order-test" 
      element={<WorkOrderTest />} 
    />
  </Route>
); 