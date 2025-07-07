
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon,
  Plus,
  Wheat,
  Beef,
  Syringe,
  Droplets,
  Clock,
  AlertTriangle
} from "lucide-react";
import { Layout } from "@/components/Layout";

interface FarmTask {
  id: number;
  title: string;
  date: Date;
  type: 'crop' | 'livestock' | 'maintenance' | 'harvest';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  description?: string;
}

const mockTasks: FarmTask[] = [
  {
    id: 1,
    title: "Fertilize corn field A",
    date: new Date(),
    type: 'crop',
    priority: 'high',
    completed: false,
    description: "Apply nitrogen fertilizer to north field"
  },
  {
    id: 2,
    title: "Vaccinate cattle group B",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    type: 'livestock',
    priority: 'high',
    completed: false,
    description: "Annual vaccination schedule"
  },
  {
    id: 3,
    title: "Harvest wheat section 3",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
    type: 'harvest',
    priority: 'medium',
    completed: false,
    description: "Ready for harvest based on moisture content"
  },
  {
    id: 4,
    title: "Repair irrigation system",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // In a week
    type: 'maintenance',
    priority: 'medium',
    completed: false,
    description: "Fix leaky pipes in section 2"
  }
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState<FarmTask[]>(mockTasks);

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.date.toDateString() === date.toDateString()
    );
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'crop': return <Wheat className="h-4 w-4" />;
      case 'livestock': return <Beef className="h-4 w-4" />;
      case 'harvest': return <Wheat className="h-4 w-4" />;
      case 'maintenance': return <Clock className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'crop': return 'bg-farm-green/10 text-farm-green border-farm-green/20';
      case 'livestock': return 'bg-farm-barn/10 text-farm-barn border-farm-barn/20';
      case 'harvest': return 'bg-farm-harvest/10 text-farm-harvest border-farm-harvest/20';
      case 'maintenance': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const upcomingTasks = tasks
    .filter(task => !task.completed && task.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const overdueTasks = tasks.filter(task => 
    !task.completed && task.date < new Date()
  );

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Farm Calendar</h1>
            <p className="text-gray-600 mt-1">Schedule and track your farm activities</p>
          </div>
          <Button className="bg-farm-green hover:bg-farm-green/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Overdue Tasks Alert */}
        {overdueTasks.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">
                  {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendar View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border w-full"
                modifiers={{
                  hasTask: (date) => getTasksForDate(date).length > 0
                }}
                modifiersStyles={{
                  hasTask: { 
                    backgroundColor: 'hsl(84 31% 44% / 0.1)',
                    color: 'hsl(84 31% 44%)',
                    fontWeight: 'bold'
                  }
                }}
              />
              
              {/* Selected Date Tasks */}
              {selectedDate && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">
                    Tasks for {selectedDate.toLocaleDateString()}
                  </h3>
                  <div className="space-y-2">
                    {getTasksForDate(selectedDate).length === 0 ? (
                      <p className="text-muted-foreground text-sm">No tasks scheduled for this date</p>
                    ) : (
                      getTasksForDate(selectedDate).map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            {getTaskIcon(task.type)}
                            <div>
                              <p className="font-medium">{task.title}</p>
                              {task.description && (
                                <p className="text-sm text-muted-foreground">{task.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getTypeColor(task.type)}>
                              {task.type}
                            </Badge>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTasks.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No upcoming tasks</p>
                ) : (
                  upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50">
                      <div className="flex-shrink-0 mt-1">
                        {getTaskIcon(task.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {task.date.toLocaleDateString()}
                        </p>
                        <div className="flex gap-1 mt-2">
                          <Badge className={`text-xs ${getTypeColor(task.type)}`}>
                            {task.type}
                          </Badge>
                          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                  <p className="text-2xl font-bold">{tasks.length}</p>
                </div>
                <CalendarIcon className="h-8 w-8 text-farm-green" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{tasks.filter(t => t.completed).length}</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{tasks.filter(t => !t.completed).length}</p>
                </div>
                <Clock className="h-8 w-8 text-farm-harvest" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">{overdueTasks.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
