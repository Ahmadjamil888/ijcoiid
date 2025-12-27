import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, Cpu, GitBranch, LayoutGrid, Rocket } from 'lucide-react';
import Logo from '@/components/logo';

const features = [
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'Autonomous AI Agents',
    description: 'Leverage a multi-agent system to plan, build, and debug your entire ML workflow.',
  },
  {
    icon: <GitBranch className="h-8 w-8 text-primary" />,
    title: 'Visual & Prompt-based Builder',
    description: 'Design complex pipelines with an intuitive drag-and-drop interface or simply describe what you need.',
  },
  {
    icon: <Cpu className="h-8 w-8 text-primary" />,
    title: 'Dynamic Code Generation',
    description: "Go from idea to execution with real, production-ready Python scripts generated on the fly. No placeholders.",
  },
  {
    icon: <Rocket className="h-8 w-8 text-primary" />,
    title: 'One-Click Deployment',
    description: 'Deploy your trained models to various targets, including local inference and cloud platforms.',
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex h-20 items-center justify-between px-4">
        <Logo />
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center px-4 py-20 text-center md:py-32">
          <h1 className="text-4xl font-extrabold tracking-tighter md:text-6xl lg:text-7xl">
            Create AI with AI.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            AI Console is an autonomous platform that turns your concepts into production-ready AI applications, powered by a team of AI agents.
          </p>
          <div className="mt-8 flex gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">Start Building for Free</Link>
            </Button>
            <Button size="lg" variant="outline">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <LayoutGrid className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-semibold uppercase text-primary">How it works</p>
            </div>
            <h2 className="mt-4 text-center text-3xl font-bold md:text-4xl">An Autonomous AI Engineer at Your Service</h2>
            <div className="relative mt-16 w-full max-w-4xl">
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border"></div>
              <div className="relative flex flex-col items-center gap-12">
                {['Define Goal', 'AI Planner', 'Agents Execute', 'Model Deployed'].map((step, i) => (
                  <div key={step} className="relative flex w-full items-center">
                    <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-background border-2 border-primary">
                      <span className="font-bold text-primary">{i + 1}</span>
                    </div>
                    <div className="ml-8 flex-1 rounded-lg border bg-card p-6">
                      <h3 className="font-semibold text-lg">{step}</h3>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {
                          [
                            "Describe your project goal in plain English, from data to deployment.",
                            "Our Planner Agent creates a comprehensive ML execution plan from your goal.",
                            "A team of specialized agents fetches data, engineers features, and trains the model.",
                            "Your model is versioned, evaluated, and ready for deployment in one click."
                          ][i]
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-card/50 py-20 md:py-32">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl font-bold md:text-4xl">The Future of MLOps is Autonomous</h2>
            <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-muted-foreground">
              Stop wrestling with boilerplate code and complex infrastructure. AI Console handles the heavy lifting so you can focus on what matters.
            </p>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col items-center p-6 text-center">
                  <CardHeader className="p-0">
                    {feature.icon}
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 mt-2">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
          <Logo />
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} AI Console. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
