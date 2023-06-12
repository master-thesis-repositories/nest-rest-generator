import modules from "@/data/export.json";


const IndexPage = () => {

  // Render
  const renderNavigation = () => {
    return <div className="w-full h-16 border-b flex flex-row px-2.5 items-center gap-4">

      {/*<div className="w-8 h-8 rounded bg-slate-400"></div>*/}

      <p className="text-slate-900 font-medium bg-slate-200 px-2.5 py-1 rounded">Appie</p>

      <div className="w-8"></div>

      <p className="text-slate-900 font-medium">Home</p>
      <p className="text-slate-900 font-medium">Projects</p>

    </div>
  }

  const renderLeftNavigation = () => {

    return <div className="h-full w-96 shrink-0 flex flex-row">
      {/* Options Bar */}
      <div className="border-r h-full w-16 bg-slate-50 flex flex-col items-center py-2 gap-2">
        <div className="w-8 h-8 rounded bg-slate-300"></div>
        <div className="w-8 h-8 rounded bg-slate-300"></div>
        <div className="w-8 h-8 rounded bg-slate-300"></div>
      </div>

      {/* Modules */}
      <div className="border-r h-full w-full bg-slate-50 py-2 px-4 flex flex-col gap-4">
        {modules.map((module) => {
          return <div key={module.name} className="flex flex-col gap-1">
            <p className="text-xs text-slate-600 font-medium uppercase">{module.name}</p>

            <div className="flex flex-col gap-1">
              {module.requests.map((request) => {
                let color = "bg-green-500";
                if (request.type !== "Get") {
                  color = "bg-orange-500";
                }

                return <div key={request.name} className="bg-slate-100 p-1 rounded flex flex-row items-center gap-2 cursor-pointer">
                  <p className={`text-slate-100 ${color} font-medium text-xs rounded h-max w-max px-1 py-0.5`}>{request.type}</p>
                  <p className="font-medium text-slate-700">{request.name}</p>
                  {/*<p>{request.path}</p>*/}
                </div>
              })}
            </div>
          </div>
        })}
      </div>
    </div>
  }

  const renderRightNavigation = () => {
    return <div className="h-full w-[480px] shrink-0 flex flex-row bg-slate-50 border-l">

    </div>
  }

  const renderPanel = () => {
    const request = modules[0].requests[0];
    const request2 = modules[0].requests[1];

    return <div className="w-full flex flex-col gap-4">
      {/* Tabs */}
      <div className="border-b w-full py-2 px-4 flex flex-row gap-1">
        <div className="bg-slate-100 p-1 rounded flex flex-row items-center gap-2 cursor-pointer w-32">
          <p className={`text-slate-100 bg-orange-500 font-medium text-xs rounded h-max w-max px-1 py-0.5`}>{request.type}</p>
          <p className="font-medium text-slate-700">{request.name}</p>
        </div>

        {/*<div className="bg-slate-100 p-1 rounded flex flex-row items-center gap-2 cursor-pointer w-32 opacity-60">*/}
        {/*  <p className={`text-slate-100 bg-orange-500 font-medium text-xs rounded h-max w-max px-1 py-0.5`}>{request2.type}</p>*/}
        {/*  <p className="font-medium text-slate-700">{request2.name}</p>*/}
        {/*</div>*/}
      </div>

      {/* Path */}
      <div className="flex flex-col gap-2 pt-2 px-4">
        <p className="font-medium text-xs uppercase text-slate-600">Endpoint</p>
        <div className="flex flex-row gap-1 w-full">
          <input className="rounded px-2 py-1 border w-16 text-center" type="text" disabled value={request.type}/>
          <input className="rounded px-2 py-1 border w-full" type="text" disabled value={request.path} />
          <button className="rounded px-2 py-1 bg-blue-500 text-slate-100 font-medium">Send</button>
        </div>
      </div>

      {/* Parameters */}
      <div className="flex flex-col gap-1 px-4">
        <p className="font-medium text-xs uppercase text-slate-600">Parameters</p>
        <div className="w-full flex flex-col gap-1">

          <div className="flex flex-row gap-1 w-full">
            <input className="border rounded px-2 py-1 w-24 text-center" type="text" value="ENABLED" disabled/>
            <input className="border rounded px-2 py-1 w-20 text-center" type="text" value="QUERY" disabled/>
            <input className="border rounded px-2 py-1 w-full" type="text" placeholder="Key"/>
            <input className="border rounded px-2 py-1 w-full" type="text" placeholder="Value"/>
          </div>

          <div className="flex flex-row gap-1 w-full">
            <input className="border rounded px-2 py-1 w-24 text-center" type="text" value="ENABLED" disabled/>
            <input className="border rounded px-2 py-1 w-20 text-center" type="text" value="PARAM" disabled/>
            <input className="border rounded px-2 py-1 w-full" type="text" placeholder="Key"/>
            <input className="border rounded px-2 py-1 w-full" type="text" placeholder="Value"/>
          </div>

        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-1 px-4">
        <p className="font-medium text-xs uppercase text-slate-600">Body</p>
        <div className="flex flex-row gap-1 w-full">
          <textarea className="rounded px-2 py-1 border w-full resize-none" rows={6}></textarea>
        </div>
      </div>

      {/* Response */}
      <div className="flex flex-col gap-1 px-4">
        <p className="font-medium text-xs uppercase text-slate-600">Response</p>
        <div className="flex flex-row gap-1 w-full">
          <textarea className="rounded px-2 py-1 border w-full resize-none" disabled rows={14}></textarea>
        </div>
      </div>

    </div>
  }


  const render = () => {
    return <div className="h-screen flex flex-col">
      {renderNavigation()}

      <div className="h-full flex flex-row">
        {renderLeftNavigation()}
        <main className="w-full h-full">
          {renderPanel()}
        </main>
        {renderRightNavigation()}
      </div>

    </div>;
  }

  return render();
};

export default IndexPage;
